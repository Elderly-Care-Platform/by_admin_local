package com.beautifulyears.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.beautifulyears.domain.User;
import com.beautifulyears.repository.custom.UserRepositoryCustom;

@Repository
public interface UserRepository extends MongoRepository<User, String>,
		UserRepositoryCustom {

	public List<User> findAll();

}
