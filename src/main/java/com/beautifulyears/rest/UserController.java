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
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.constants.ActivityLogConstants;
import com.beautifulyears.constants.BYConstants;
import com.beautifulyears.constants.DiscussConstants;
import com.beautifulyears.domain.BySession;
import com.beautifulyears.domain.HousingFacility;
import com.beautifulyears.domain.LoginRequest;
import com.beautifulyears.domain.LoginResponse;
import com.beautifulyears.domain.Session;
import com.beautifulyears.domain.User;
import com.beautifulyears.domain.UserProfile;
import com.beautifulyears.domain.UserRolePermissions;
import com.beautifulyears.exceptions.BYErrorCodes;
import com.beautifulyears.exceptions.BYException;
import com.beautifulyears.repository.UserRepository;
import com.beautifulyears.rest.response.BYGenericResponseHandler;
import com.beautifulyears.util.LoggerUtil;
import com.beautifulyears.util.UserNameHandler;
import com.beautifulyears.util.Util;
import com.beautifulyears.util.activityLogHandler.ActivityLogHandler;
import com.beautifulyears.util.activityLogHandler.UserActivityLogHandler;

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
	ActivityLogHandler<User> logHandler;

	@Autowired
	public UserController(UserRepository userRepository,
			MongoTemplate mongoTemplate) {
		this.userRepository = userRepository;
		this.mongoTemplate = mongoTemplate;
		logHandler = new UserActivityLogHandler(mongoTemplate);
	}

	@RequestMapping(value = "/login", method = RequestMethod.POST)
	public @ResponseBody Object login(@RequestBody LoginRequest loginRequest,
			HttpServletRequest req, HttpServletResponse res) {
		LoggerUtil.logEntry();

		try {
			Query q = new Query();
			if (loginRequest.getUserIdType() == BYConstants.REGISTRATION_TYPE_EMAIL) {
				if (!Util.isEmpty(loginRequest.getEmail())
						&& !Util.isEmpty(loginRequest.getPassword())) {
					q.addCriteria(Criteria.where("email")
							.is(loginRequest.getEmail()).and("isActive")
							.is("Active"));
				} else {
					System.out.println("No such user exist");
					LoginResponse blankUser = getBlankUser("UserName or password can't be left blank");
					return BYGenericResponseHandler.getResponse(blankUser);
				}
			} else if (loginRequest.getUserIdType() == BYConstants.REGISTRATION_TYPE_PHONE) {
				killSession(req, res);
				LoginResponse blankUser = getBlankUser("Only Email Users allowed");
				return BYGenericResponseHandler.getResponse(blankUser);
			}
			User user = mongoTemplate.findOne(q, User.class);
			if (null == user) {
				logger.debug("User login failed with user email : "
						+ loginRequest.getEmail());
				killSession(req, res);
				LoginResponse blankUser = getBlankUser("User not found in system");
				return BYGenericResponseHandler.getResponse(blankUser);
			} else {
				if (Util.isPasswordMatching(loginRequest.getPassword(),
						user.getPassword())
						&& ("SUPER_USER".equals(user.getUserRoleId()) || "EDITOR"
								.equals(user.getUserRoleId()))) {
					logger.debug("User logged in success for user email = "
							+ loginRequest.getEmail());
					Session session = createSession(req, res, user);
					logger.debug("User exists :: userid = " + user.getId()
							+ " :: username = " + user.getUserName());
					LoginResponse response = new LoginResponse();
					response.setSessionId(session.getSessionId());
					response.setStatus("OK other user");
					response.setId(session.getUserId());
					response.setUserName(session.getUserName());
					response.setUserRoleId(user.getUserRoleId());
					return BYGenericResponseHandler.getResponse(response);
				}else{
					killSession(req, res);
					LoginResponse blankUser = getBlankUser("User credentials doesn't match or user don't have sufficient permissions");
					return BYGenericResponseHandler.getResponse(blankUser);
				}
			}

		} catch (Exception e) {
			killSession(req, res);
			System.out.println("No such user exist");
			LoginResponse blankUser = getBlankUser("UserName or password can't be left blank");
			return BYGenericResponseHandler.getResponse(blankUser);

		}

	}

	@RequestMapping(method = RequestMethod.GET, value = "/logout", produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody Object logout(HttpServletRequest req,
			HttpServletResponse res) throws Exception {
		LoggerUtil.logEntry();
		Session session = null;
		try {
			logger.debug("logging out");
			session = killSession(req, res);
		} catch (Exception e) {
			Util.handleException(e);
		}
		return BYGenericResponseHandler.getResponse(session);
	}

	@RequestMapping(method = RequestMethod.GET, value = "/list/all", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Object allUsers() {
		List<User> userList = userRepository.findAll(new Sort(
				Sort.Direction.DESC, "createdAt"));
		return BYGenericResponseHandler.getResponse(userList);
	}

	// create user - registration
	@RequestMapping(value = "/{userId}", consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Object submitUser(@RequestBody User user, HttpServletRequest req,
			HttpServletResponse res) throws Exception {
		if (user == null || user.getId() == null || user.getId().equals("")) {
			logger.debug("NEW USER");
			try {
				Query q = new Query();
				if (user.getUserIdType() == BYConstants.REGISTRATION_TYPE_EMAIL) {
					q.addCriteria(Criteria.where("email").is(user.getEmail()));
				} else if (user.getUserIdType() == BYConstants.REGISTRATION_TYPE_PHONE) {
					q.addCriteria(Criteria.where("phoneNumber").is(
							user.getPhoneNumber()));
				} else {
					throw new BYException(BYErrorCodes.INVALID_REQUEST);
				}

				if (userRepository.exists(q.toString())) {
					throw new BYException(BYErrorCodes.USER_ALREADY_EXIST);
				}
				User userWithExtractedInformation = decorateWithInformation(user);
				userWithExtractedInformation = userRepository
						.save(userWithExtractedInformation);
				logHandler.addLog(userWithExtractedInformation,
						ActivityLogConstants.CRUD_TYPE_CREATE, req);
				return BYGenericResponseHandler.getResponse(null);
			} catch (Exception e) {
				e.printStackTrace();
				throw e;
			}

		} else {
			logger.debug("EDIT USER");
			boolean isUserNameChanged = false;
			User newUser = userRepository.findOne(user.getId());
			if (!newUser.getUserName().equals(user.getUserName())) {
				isUserNameChanged = true;
				logger.debug("trying changing the user name from "
						+ newUser.getUserName() + " to " + user.getUserName());
			}
			if (null != newUser && !Util.isEmpty(user.getPassword())) {
				if (!user.getPassword().equals(newUser.getPassword())) {
					inValidateAllSessions(user.getId());
				}
				newUser.setPassword(Util.getEncodedPwd(user.getPassword()));
			}
			newUser.setSocialSignOnId(user.getSocialSignOnId());
			newUser.setSocialSignOnPlatform(user.getSocialSignOnPlatform());
			newUser.setPasswordCode(user.getPasswordCode());
			newUser.setPasswordCodeExpiry(user.getPasswordCodeExpiry());
			newUser.setUserRoleId(user.getUserRoleId());
			newUser.setUserName(user.getUserName());
			newUser.setUserIdType(user.getUserIdType());
			newUser.setUserRegType(user.getUserRegType());

			newUser.setActive(user.isActive());
			if (user.getUserIdType() == BYConstants.REGISTRATION_TYPE_EMAIL
					&& !user.getEmail().equals(newUser.getEmail())) {
				newUser.setPhoneNumber("");
				Query q = new Query();
				q.addCriteria(Criteria.where("email").is(user.getEmail()));
				User userWithEmail = mongoTemplate.findOne(q, User.class);
				if (userWithEmail != null) {
					throw new BYException(BYErrorCodes.USER_ALREADY_EXIST);
				} else {
					newUser.setEmail(user.getEmail());
				}
			} else if (user.getUserIdType() == BYConstants.REGISTRATION_TYPE_PHONE
					&& !user.getPhoneNumber().equals(newUser.getPhoneNumber())) {
				newUser.setEmail("");
				Query q = new Query();
				q.addCriteria(Criteria.where("phoneNumber").is(
						user.getPhoneNumber()));
				User userWithPhoneNumber = mongoTemplate.findOne(q, User.class);
				if (userWithPhoneNumber != null) {
					throw new BYException(BYErrorCodes.USER_ALREADY_EXIST);
				} else {
					newUser.setPhoneNumber(user.getPhoneNumber());
				}
			}
			newUser = userRepository.save(newUser);
			logHandler.addLog(newUser, ActivityLogConstants.CRUD_TYPE_UPDATE,
					req);
			if (isUserNameChanged) {
				UserNameHandler userNameHandler = new UserNameHandler(
						mongoTemplate);
				userNameHandler.setUserParams(newUser.getId(),
						newUser.getUserName());
				new Thread(userNameHandler).start();
			}
			return BYGenericResponseHandler.getResponse(newUser);
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
		Integer userIdType = user.getUserIdType();
		Integer userRegType = user.getUserRegType();
		String phoneNumber = user.getPhoneNumber();

		// Users registered through the BY site will always have ROLE = USER
		String userRoleId = "USER";

		// TODO: Change this logic during user regitration phase 2
		if (userRoleId != null
				&& (userRoleId.equals(UserRolePermissions.USER) || userRoleId
						.equals(UserRolePermissions.WRITER))) {
			return new User(userName, userIdType, userRegType, password, email,
					phoneNumber, verificationCode, verificationCodeExpiry,
					socialSignOnId, socialSignOnPlatform, passwordCode,
					passwordCodeExpiry, userRoleId, "In-Active");

		} else {
			return new User(userName, userIdType, userRegType, password, email,
					phoneNumber, verificationCode, verificationCodeExpiry,
					socialSignOnId, socialSignOnPlatform, passwordCode,
					passwordCodeExpiry, userRoleId, "In-Active");
		}
	}

	@RequestMapping(method = RequestMethod.DELETE, value = "/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Object deleteUser(@PathVariable("userId") String userId,
			HttpServletRequest req) throws Exception {
		logger.debug("Inside DELETE user");
		userRepository.delete(userId);

		Query q = new Query();
		q.addCriteria(Criteria.where("userId").is(userId));
		User user = mongoTemplate.findOne(q, User.class);
		List<UserProfile> profiles = mongoTemplate.find(q, UserProfile.class);
		List<HousingFacility> housings = mongoTemplate.find(q, HousingFacility.class);
		mongoTemplate.remove(user);
		for(UserProfile profile : profiles ){
			mongoTemplate.remove(profile);
		}
		for(HousingFacility housing : housings ){
			mongoTemplate.remove(housing);
		}
		logHandler.addLog(user, ActivityLogConstants.CRUD_TYPE_DELETE, req);
		return BYGenericResponseHandler.getResponse(null);
	}

	@RequestMapping(value = "/resetPassword", method = RequestMethod.GET)
	public @ResponseBody Object getResetPasswordLink(
			@RequestParam(value = "email", required = true) String email,
			HttpServletRequest req) {
		LoggerUtil.logEntry();
		if (!Util.isEmpty(email)) {
			Query q = new Query();
			q.addCriteria(Criteria.where("email").regex(email, "i"));
			User user = mongoTemplate.findOne(q, User.class);
			if (null != user) {
				user.setVerificationCode(UUID.randomUUID().toString());
				Date t = new Date();
				user.setVerificationCodeExpiry(new Date(
						t.getTime()
								+ (BYConstants.FORGOT_PASSWORD_CODE_EXPIRY_IN_MIN * 60000)));

				mongoTemplate.save(user);
			} else {
				throw new BYException(BYErrorCodes.USER_EMAIL_DOES_NOT_EXIST);
			}
		} else {
			throw new BYException(BYErrorCodes.MISSING_PARAMETER);
		}

		return true;
	}

	@RequestMapping(method = RequestMethod.PUT, value = "/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Object editUser(@PathVariable("userId") String userId) {
		User user = userRepository.findOne(userId);
		if (user == null) {
			throw new UserNotFoundException(userId);
		}
		return BYGenericResponseHandler.getResponse(user);
	}

	// - getUserByVerificationCode - users/{userId}

	@RequestMapping(method = RequestMethod.GET, value = "/show/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody Object showUser(@PathVariable("userId") String userId) {
		User user = userRepository.findOne(userId);
		if (user == null) {
			throw new UserNotFoundException(userId);
		}

		return BYGenericResponseHandler.getResponse(user);
	}

	@RequestMapping(method = RequestMethod.GET, value = "/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody Object getUser(@PathVariable("userId") String userId) {
		User user = userRepository.findOne(userId);
		if (user == null) {
			throw new UserNotFoundException(userId);
		}
		return BYGenericResponseHandler.getResponse(user);
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
		q.addCriteria(Criteria.where("userId").is(userId));
		List<BySession> sessionList = mongoTemplate.find(q, BySession.class);
		for (BySession session : sessionList) {
			session.setStatus(DiscussConstants.SESSION_STATUS_INACTIVE);
			mongoTemplate.save(session);
		}
	}

}