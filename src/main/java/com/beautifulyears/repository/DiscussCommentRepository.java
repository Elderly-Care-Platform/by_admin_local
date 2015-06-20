package com.beautifulyears.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.beautifulyears.domain.DiscussComment;

@Repository
public interface DiscussCommentRepository extends
		MongoRepository<DiscussComment, String> {

	public List<DiscussComment> findAll();

}
