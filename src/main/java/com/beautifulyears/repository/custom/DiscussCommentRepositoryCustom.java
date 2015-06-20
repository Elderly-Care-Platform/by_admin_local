package com.beautifulyears.repository.custom;

import java.util.List;

import org.springframework.data.mongodb.core.query.Query;

import com.beautifulyears.domain.DiscussComment;

public interface DiscussCommentRepositoryCustom {
	public List<DiscussComment> findByDiscussType(String discussType)
			throws Exception;

	public List<DiscussComment> find(Query q, Class<DiscussComment> class1);

}
