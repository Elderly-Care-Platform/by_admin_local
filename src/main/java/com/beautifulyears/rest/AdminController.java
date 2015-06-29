package com.beautifulyears.rest;

import java.util.Date;
import java.util.List;
import java.util.UUID;

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

import com.beautifulyears.domain.LoginRequest;
import com.beautifulyears.domain.LoginResponse;
import com.beautifulyears.domain.User;
import com.beautifulyears.domain.UserRolePermissions;
import com.beautifulyears.repository.UserRepository;

/**
 * /** The REST based service for managing "users"
 * 
 * @author jumpstart
 *
 */

@Controller
@RequestMapping("/users")
public class AdminController {
	private static final Logger logger = Logger.getLogger(AdminController.class);
	private UserRepository userRepository;
	private MongoTemplate mongoTemplate;

	@Autowired
	public AdminController(UserRepository userRepository,
			MongoTemplate mongoTemplate) {
		this.userRepository = userRepository;
		this.mongoTemplate = mongoTemplate;
	}

	@RequestMapping(value = "/login", method = RequestMethod.POST)
	public @ResponseBody LoginResponse login(
			@RequestBody LoginRequest loginRequest) {
		logger.debug("login request email = " + loginRequest.getEmail());

		Query q = new Query();
		q.addCriteria(Criteria.where("email").is(loginRequest.getEmail())
				.and("password").is(loginRequest.getPassword()).and("isActive")
				.is("Active"));

		// admin login
		if (loginRequest.getEmail().equals("admin")
				&& loginRequest.getPassword().equals("password")) {
			LoginResponse response = new LoginResponse();
			response.setSessionId(UUID.randomUUID().toString());
			response.setStatus("OK admin");
			response.setId("admin");
			response.setUserName("admin");
			response.setUserRoleId(UserRolePermissions.SUPER_USER);
			return response;
		}
		// normal user login
		else {
			logger.debug("Trying to login normal user...");
			boolean exists = mongoTemplate.exists(q, User.class);
			if (!exists) {
				System.out.println("No such user exist");
				LoginResponse response = new LoginResponse();
				response.setSessionId(null);
				response.setStatus("Incorrect combination of username and password");
				response.setId("");
				response.setUserName("");
				response.setUserRoleId("");
				return response;
			} else {
				User user = mongoTemplate.findOne(q, User.class);
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
		return userRepository.findAll(new Sort(Sort.Direction.DESC,"createdAt"));
	}

	// create user - registration
	@RequestMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public ResponseEntity<String> submitUser(@RequestBody User user) throws Exception{
		if (user == null || user.getId() == null || user.getId().equals("")) {
			logger.debug("NEW USER");
			try {
				Query q = new Query();
				q.addCriteria(Criteria.where("email").is(user.getEmail()));
				if(userRepository.exists(q.toString()))
				{
					ResponseEntity<String> responseEntity = new ResponseEntity<String>(
							"Email already exists!", HttpStatus.CREATED);
					throw new Exception("Email already exists!");
				}
				User userWithExtractedInformation = decorateWithInformation(user);
				userRepository.save(userWithExtractedInformation);
				ResponseEntity<String> responseEntity = new ResponseEntity<String>(HttpStatus.CREATED);
				return responseEntity;
			} catch (Exception e) {
				e.printStackTrace();
				ResponseEntity<String> responseEntity = new ResponseEntity<String>(HttpStatus.INTERNAL_SERVER_ERROR);
				throw e;
			}

		} else {
			logger.debug("EDIT USER");
			User newUser = getUser(user.getId());
			newUser.setPassword(user.getPassword());
			newUser.setSocialSignOnId(user.getSocialSignOnId());
			newUser.setSocialSignOnPlatform(user.getSocialSignOnPlatform());
			newUser.setPasswordCode(user.getPasswordCode());
			newUser.setPasswordCodeExpiry(user.getPasswordCodeExpiry());
			newUser.setUserRoleId(user.getUserRoleId());
			newUser.setActive(user.isActive());
			userRepository.save(newUser);
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

}