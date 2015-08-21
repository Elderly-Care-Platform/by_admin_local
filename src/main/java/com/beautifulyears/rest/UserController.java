package com.beautifulyears.rest;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.constants.DiscussConstants;
import com.beautifulyears.domain.BySession;
import com.beautifulyears.domain.Discuss;
import com.beautifulyears.domain.DiscussReply;
import com.beautifulyears.domain.LoginRequest;
import com.beautifulyears.domain.LoginResponse;
import com.beautifulyears.domain.Session;
import com.beautifulyears.domain.User;
import com.beautifulyears.domain.UserRating;
import com.beautifulyears.domain.UserRolePermissions;
import com.beautifulyears.exceptions.BYErrorCodes;
import com.beautifulyears.exceptions.BYException;
import com.beautifulyears.repository.UserRepository;
import com.beautifulyears.util.LoggerUtil;
import com.beautifulyears.util.UserNameHandler;
import com.beautifulyears.util.Util;

/**
 * /** The REST based service for managing "users"
 * 
 * @author jumpstart
 *
 */

@Controller
@RequestMapping("/users")
public class UserController {
	private static final Logger logger = Logger.getLogger(UserController.class);
	private UserRepository userRepository;
	private MongoTemplate mongoTemplate;

	@Autowired
	public UserController(UserRepository userRepository,
			MongoTemplate mongoTemplate) {
		this.userRepository = userRepository;
		this.mongoTemplate = mongoTemplate;
	}

	@RequestMapping(value = "/login", method = RequestMethod.POST)
	public @ResponseBody LoginResponse login(
			@RequestBody LoginRequest loginRequest, HttpServletRequest req,
			HttpServletResponse res) {
		LoggerUtil.logEntry();
		Session session = null;

		try {
			if (!Util.isEmpty(loginRequest.getEmail())
					&& !Util.isEmpty(loginRequest.getPassword())) {
				Query q = new Query();
				q.addCriteria(Criteria.where("email")
						.is(loginRequest.getEmail()).and("password")
						.is(loginRequest.getPassword()).and("isActive")
						.is("Active"));

				User user = mongoTemplate.findOne(q, User.class);
				if (null == user) {
					logger.debug("User login failed with user email : "
							+ loginRequest.getEmail());
					session = killSession(req, res);
					return getBlankUser("UserName or password can't be left blank");
				} else {
					logger.debug("User logged in success for user email = "
							+ loginRequest.getEmail());
					session = createSession(req, res, user);
					logger.debug("User exists :: userid = " + user.getId()
							+ " :: username = " + user.getUserName());
					LoginResponse response = new LoginResponse();
					response.setSessionId(UUID.randomUUID().toString());
					response.setStatus("OK other user");
					response.setId(user.getId());
					response.setUserName(user.getUserName());
					response.setUserRoleId(user.getUserRoleId());
					return response;
				}
			} else {
				System.out.println("No such user exist");
				return getBlankUser("UserName or password can't be left blank");
			}

		} catch (Exception e) {
			System.out.println("No such user exist");
			return getBlankUser("UserName or password can't be left blank");
		}

	}

	@RequestMapping(method = RequestMethod.GET, value = "/logout/{sessionId}", produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody LoginResponse logout(
			@PathVariable("sessionId") String sessionId) {
		try {
			LoginResponse response = new LoginResponse();
			response.setSessionId(null);
			response.setStatus("");
			return response;
		} catch (Exception e) {
			e.printStackTrace();
			LoginResponse response = new LoginResponse();
			response.setSessionId(null);
			response.setStatus("");
			return response;
		}
	}

	@RequestMapping(method = RequestMethod.GET, value = "/list/all", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public List<User> allUsers() {
		return userRepository
				.findAll(new Sort(Sort.Direction.DESC, "createdAt"));
	}

	// create user - registration
	@RequestMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Object submitUser(@RequestBody User user, HttpServletRequest req,
			HttpServletResponse res) throws Exception {
		if (user == null || user.getId() == null || user.getId().equals("")) {
			logger.debug("NEW USER");
			try {
				Query q = new Query();
				q.addCriteria(Criteria.where("email").is(user.getEmail()));
				if (userRepository.exists(q.toString())) {
					return new ResponseEntity<>("Email already exists!",
							HttpStatus.BAD_REQUEST);
				}
				User userWithExtractedInformation = decorateWithInformation(user);
				userRepository.save(userWithExtractedInformation);
				ResponseEntity<String> responseEntity = new ResponseEntity<String>(
						HttpStatus.CREATED);
				return responseEntity;
			} catch (Exception e) {
				e.printStackTrace();
				throw e;
			}

		} else {
			logger.debug("EDIT USER");
			boolean isUserNameChanged = false;
			User newUser = getUser(user.getId());
			if (!newUser.getUserName().equals(user.getUserName())) {
				isUserNameChanged = true;
				logger.debug("trying changing the user name from "
						+ newUser.getUserName() + " to " + user.getUserName());
			}
			if (null != newUser && user.getPassword() != null) {
				if (!user.getPassword().equals(newUser.getPassword())) {
					inValidateAllSessions(user.getId());
				}
				newUser.setPassword(user.getPassword());
			}
			newUser.setSocialSignOnId(user.getSocialSignOnId());
			newUser.setSocialSignOnPlatform(user.getSocialSignOnPlatform());
			newUser.setPasswordCode(user.getPasswordCode());
			newUser.setPasswordCodeExpiry(user.getPasswordCodeExpiry());
			newUser.setUserRoleId(user.getUserRoleId());
			newUser.setUserName(user.getUserName());

			newUser.setActive(user.isActive());
			if (!newUser.getEmail().equals(user.getEmail())) {
				Query q = new Query();
				q.addCriteria(Criteria.where("email").is(user.getEmail()));
				User userWithEmail = mongoTemplate.findOne(q, User.class);
				if (userWithEmail != null) {
					throw new BYException(BYErrorCodes.USER_ALREADY_EXIST);
				} else {
					newUser.setEmail(user.getEmail());
				}
			}
			userRepository.save(newUser);
			if (isUserNameChanged) {
				UserNameHandler userNameHandler = new UserNameHandler(
						mongoTemplate);
				userNameHandler.setUserParams(newUser.getId(),
						newUser.getUserName());
				new Thread(userNameHandler).start();
			}
			ResponseEntity<String> responseEntity = new ResponseEntity<>(
					HttpStatus.CREATED);
			return responseEntity;
		}

	}

	private User decorateWithInformation(User user) {
		String userName = user.getUserName();
		String password = user.getPassword();
		String email = user.getEmail();
		String verificationCode = user.getVerificationCode();
		Date verificationCodeExpiry = user.getVerificationCodeExpiry();
		String socialSignOnId = user.getSocialSignOnId();
		String socialSignOnPlatform = user.getSocialSignOnPlatform();
		String passwordCode = user.getPassword();
		Date passwordCodeExpiry = user.getPasswordCodeExpiry();

		// Users registered through the BY site will always have ROLE = USER
		String userRoleId = "USER";

		// TODO: Change this logic during user regitration phase 2
		if (userRoleId != null
				&& (userRoleId.equals(UserRolePermissions.USER) || userRoleId
						.equals(UserRolePermissions.WRITER))) {
			return new User(userName, password, email, verificationCode,
					verificationCodeExpiry, socialSignOnId,
					socialSignOnPlatform, passwordCode, passwordCodeExpiry,
					userRoleId, "In-Active");
		} else {
			return new User(userName, password, email, verificationCode,
					verificationCodeExpiry, socialSignOnId,
					socialSignOnPlatform, passwordCode, passwordCodeExpiry,
					userRoleId, "In-Active");
		}
	}

	@RequestMapping(method = RequestMethod.DELETE, value = "/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public ResponseEntity<Void> deleteUser(@PathVariable("userId") String userId) {
		logger.debug("Inside DELETE user");
		userRepository.delete(userId);
		ResponseEntity<Void> responseEntity = new ResponseEntity<>(
				HttpStatus.CREATED);
		return responseEntity;
	}

	@RequestMapping(method = RequestMethod.PUT, value = "/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public User editUser(@PathVariable("userId") String userId) {
		User user = userRepository.findOne(userId);
		if (user == null) {
			throw new UserNotFoundException(userId);
		}
		return user;
	}

	// - getUserByVerificationCode - users/{userId}

	@RequestMapping(method = RequestMethod.GET, value = "/show/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody User showUser(@PathVariable("userId") String userId) {
		User user = userRepository.findOne(userId);
		if (user == null) {
			throw new UserNotFoundException(userId);
		}
		return user;
	}

	@RequestMapping(method = RequestMethod.GET, value = "/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody User getUser(@PathVariable("userId") String userId) {
		User user = userRepository.findOne(userId);
		if (user == null) {
			throw new UserNotFoundException(userId);
		}
		return user;
	}

	private Session createSession(HttpServletRequest req,
			HttpServletResponse res, User user) {
		LoggerUtil.logEntry();
		Session session = new Session(user, req);
		mongoTemplate.save(session);
		req.getSession().setAttribute("session", session);
		req.getSession().setAttribute("user", user);
		return session;
	}

	private Session killSession(HttpServletRequest req, HttpServletResponse res) {
		LoggerUtil.logEntry();
		Session session = (Session) req.getSession().getAttribute("session");
		if (null != session) {
			session.setStatus(DiscussConstants.SESSION_STATUS_INACTIVE);
			mongoTemplate.save(session);
			req.getSession().invalidate();
		}
		return null;
	}

	private LoginResponse getBlankUser(String msg) {
		System.out.println("No such user exist");
		LoginResponse response = new LoginResponse();
		response.setSessionId(null);
		response.setStatus(msg);
		response.setId("");
		response.setUserName("");
		response.setUserRoleId("");
		return response;
	}
	
	private void inValidateAllSessions(String userId) {
		Query q = new Query();
		q.addCriteria(Criteria
				.where("userId").is(userId));
		List<BySession> sessionList = mongoTemplate.find(q, BySession.class);
		for (BySession session : sessionList) {
			session.setStatus(DiscussConstants.SESSION_STATUS_INACTIVE);
			mongoTemplate.save(session);
		}
	}

}