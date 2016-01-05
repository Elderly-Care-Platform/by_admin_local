package com.beautifulyears.util;

import javax.servlet.http.HttpServletRequest;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.beautifulyears.constants.DiscussConstants;
import com.beautifulyears.domain.User;
import com.beautifulyears.exceptions.BYErrorCodes;
import com.beautifulyears.exceptions.BYException;

public class Util {

	private static final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
	
	public static boolean isEmpty(String value) {
		return value == null || value.length() == 0;
	}

	public static User getSessionUser(HttpServletRequest req) throws Exception {
		Object user = req.getSession().getAttribute("user");
		if(null != user){
			return (User) user;
		}else{
			throw new BYException(BYErrorCodes.USER_LOGIN_REQUIRED);
		}
		
	}
	
	public static boolean isSuperUser(User user){
		boolean isSuperUser = false;
		if(null != user && ("SUPER_USER").equals(user.getUserRoleId())){
			isSuperUser = true;
		}
		return isSuperUser;
	}
	
	public static String truncateText(String text){
		if(text != null && text.length() > DiscussConstants.DISCUSS_TRUNCATION_LENGTH){
			int max = DiscussConstants.DISCUSS_TRUNCATION_LENGTH;
			int end = text.lastIndexOf(' ', max - 3);

		    // Just one long word. Chop it off.
		    if (end == -1){
		    	text = text.substring(0, max-3) + "...";
		    }
		    else{
		    	text = text.substring(0, end) + "...";
		    }
		}
		return text;
	}
	
	public static void handleException(Exception e) throws Exception {
		if (e instanceof BYException) {
			throw e;
		} else {
			try {
				StackTraceElement currentStack = Thread.currentThread()
						.getStackTrace()[2];
				if (null != currentStack) {
//					logger.error("Exception occured in " + currentStack.getClassName()
//							+ "::" + currentStack.getMethodName());
				}
			} catch (Exception exception) {

			}
			throw new BYException(BYErrorCodes.INTERNAL_SERVER_ERROR);

		}
	}
	
	public static String getEncodedPwd(String pwd){
		String ret = null;
		if(!Util.isEmpty(pwd)){
			ret = passwordEncoder.encode(pwd);
		}
		return ret;
	}
	
	public static boolean isPasswordMatching(String enteredPassword, String dbPassword){
		boolean ret = true;
		ret = passwordEncoder.matches(enteredPassword, dbPassword);
		if(!ret){
			throw new BYException(BYErrorCodes.USER_LOGIN_FAILED);
		}
		return ret;
	}
}
