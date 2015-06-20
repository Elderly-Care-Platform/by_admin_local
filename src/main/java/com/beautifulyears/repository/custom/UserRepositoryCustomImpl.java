package com.beautifulyears.repository.custom;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.beautifulyears.domain.User;

public class UserRepositoryCustomImpl implements UserRepositoryCustom {
	@Autowired
	private MongoTemplate mongoTemplate;

	@Override
	public User getById(String id) throws Exception {
		System.out.println("Inside getById user impl");
		Criteria criteria = Criteria.where("id").is(id);// .andOperator(Criteria.where("availability").is(1));
		return mongoTemplate.findOne(Query.query(criteria), User.class);

	}

	@Override
	public User getByUserName(String userName) throws Exception {
		System.out.println("Inside getByUsername user impl");
		Criteria criteria = Criteria.where("userName").is(userName);// .andOperator(Criteria.where("availability").is(1));
		return mongoTemplate.findOne(Query.query(criteria), User.class);

	}

	@Override
	public User getByVerificationCode(String verificationCode) throws Exception {
		System.out.println("Inside getByVerificationCode user impl");
		Criteria criteria = Criteria.where("verificationCode")
				.is(verificationCode).and("verificationCodeExpiry")
				.gt(new Date());// .andOperator(Criteria.where("availability").is(1));
		return mongoTemplate.findOne(Query.query(criteria), User.class);
	}
}