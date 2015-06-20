package com.beautifulyears.repository.custom;

import java.util.List;

import com.beautifulyears.domain.User;


public interface UserRepositoryCustom  {

	 public User getById(String id) throws Exception;
	 
	 public User getByUserName(String userName) throws Exception;
	 
	 public User getByVerificationCode(String verificationCode) throws Exception;
	 
	 
}
