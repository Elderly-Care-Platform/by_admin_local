package com.beautifulyears.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.beautifulyears.domain.DiscussReply;

@Repository
public interface DiscussCommentRepository extends
		MongoRepository<DiscussReply, String> {

	public List<DiscussReply> findAll();

}
