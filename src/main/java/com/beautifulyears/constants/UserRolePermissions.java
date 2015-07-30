package com.beautifulyears.constants;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class UserRolePermissions {
	
	public static String SUPER_USER = "SUPER_USER";
	public static String EDITOR = "EDITOR";
	public static String WRITER = "WRITER";
	public static String USER = "USER"; 
	
	public static Integer CREATE_ARTICLE = 0;
	public static Integer CREATE_POST = 0;
	public static Integer CREATE_QUESTION = 0;
	public static Integer CREATE_COMMENT = 0;
	public static Integer CREATE_LIKE = 0;
	public static Integer CREATE_SHARE = 0;
	public static Integer EDIT_ARTICLE = 1;
	public static Integer EDIT_POST = 1;
	public static Integer EDIT_QUESTION = 1;
	public static Integer EDIT_COMMENT = 1;
	public static Integer DELETE_ARTICLE = 2;
	public static Integer DELETE_POST = 2;
	public static Integer DELETE_QUESTION = 2;
	public static Integer DELETE_COMMENT = 2;
	
	public static Integer PUBLISH = 3;
	
	public static Integer CREATE_USER = 4;
	public static Integer EDIT_USER = 4;
	public static Integer DELETE_USER = 4;
	
	
	private static UserRolePermissions userRolePerms;
	
	private static Map<String, List<Integer>> userRolePermMap = new HashMap<String, List<Integer>>();
	
	
	private UserRolePermissions()
	{
		List<Integer> super_admin_perms = new ArrayList<Integer>();
		List<Integer> user_perms = new ArrayList<Integer>();
		List<Integer> editor_perms = new ArrayList<Integer>();
		List<Integer> writer_perms = new ArrayList<Integer>();
		
		
		//super_admin
		super_admin_perms.add(CREATE_ARTICLE);
		super_admin_perms.add(CREATE_POST);
		super_admin_perms.add(CREATE_QUESTION);
		super_admin_perms.add(CREATE_COMMENT);
		super_admin_perms.add(CREATE_LIKE);
		super_admin_perms.add(CREATE_SHARE);
		super_admin_perms.add(EDIT_ARTICLE);
		super_admin_perms.add(EDIT_POST);
		super_admin_perms.add(EDIT_QUESTION);
		super_admin_perms.add(EDIT_COMMENT);
		super_admin_perms.add(DELETE_ARTICLE);
		super_admin_perms.add(DELETE_POST);
		super_admin_perms.add(DELETE_QUESTION);
		super_admin_perms.add(DELETE_COMMENT);
		super_admin_perms.add(PUBLISH);
		super_admin_perms.add(CREATE_USER);
		super_admin_perms.add(EDIT_USER);
		super_admin_perms.add(DELETE_USER);
		
		
		//user
		user_perms.add(CREATE_ARTICLE);
		user_perms.add(CREATE_POST);
		user_perms.add(CREATE_QUESTION);
		user_perms.add(CREATE_COMMENT);
		user_perms.add(CREATE_LIKE);
		user_perms.add(CREATE_SHARE);
		user_perms.add(EDIT_ARTICLE);
		
		//writer
		writer_perms.add(CREATE_ARTICLE);
		writer_perms.add(CREATE_POST);
		writer_perms.add(CREATE_QUESTION);
		writer_perms.add(CREATE_COMMENT);
		writer_perms.add(CREATE_LIKE);
		writer_perms.add(CREATE_SHARE);
		writer_perms.add(EDIT_ARTICLE);
		
		//editor
		editor_perms.add(CREATE_ARTICLE);
		editor_perms.add(CREATE_POST);
		editor_perms.add(CREATE_QUESTION);
		editor_perms.add(CREATE_COMMENT);
		editor_perms.add(CREATE_LIKE);
		editor_perms.add(CREATE_SHARE);
		editor_perms.add(EDIT_ARTICLE);
		editor_perms.add(EDIT_POST);
		editor_perms.add(EDIT_QUESTION);
		editor_perms.add(EDIT_COMMENT);
		editor_perms.add(DELETE_ARTICLE);
		editor_perms.add(DELETE_POST);
		editor_perms.add(DELETE_QUESTION);
		editor_perms.add(DELETE_COMMENT);
		editor_perms.add(PUBLISH);
		
		
		userRolePermMap.put(SUPER_USER, super_admin_perms);
		userRolePermMap.put(USER, user_perms);
		userRolePermMap.put(WRITER, writer_perms);
		userRolePermMap.put(EDITOR, editor_perms);
	}
	
	public static UserRolePermissions getInstance()
	{
		if(userRolePerms == null)
			userRolePerms = new UserRolePermissions();
		return userRolePerms;
	}
	
	
	public static List<Integer> getUserPermsForRole(String userRoleId)
	{
		return userRolePermMap.get(userRoleId);
	}
	

}
