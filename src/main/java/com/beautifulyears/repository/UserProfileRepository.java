package com.beautifulyears.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.beautifulyears.domain.UserProfile;


@Repository
public interface UserProfileRepository extends PagingAndSortingRepository<UserProfile, String>{

	UserProfile findByUserId(String UserId);
	UserProfile findById(String id);
	
	 @Query("{'userTypes':{$in:?0}}" )
	 public Page<UserProfile> getServiceProvidersByCriteria(Object[] userTypes, Pageable page);
	
}