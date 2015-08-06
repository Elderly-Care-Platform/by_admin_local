package com.beautifulyears.util;

import javax.servlet.http.HttpServletRequest;

import com.beautifulyears.domain.User;

public class Util {

	public static boolean isEmpty(String value) {
		return value == null || value.length() == 0;
	}

	public static User getSessionUser(HttpServletRequest req) {
		return (User) req.getSession().getAttribute("user");
	}
}
