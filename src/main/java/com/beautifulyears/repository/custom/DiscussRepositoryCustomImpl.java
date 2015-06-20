package com.beautifulyears.repository.custom;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.beautifulyears.domain.Discuss;

public class DiscussRepositoryCustomImpl implements DiscussRepositoryCustom {
    @Autowired
    private MongoTemplate mongoTemplate;

   
	@Override
	public List<Discuss> findByDiscussType(String discussType) throws Exception{
		System.out.println("Inside findByDiscussType impl");
		Criteria criteria = Criteria.where("discussType").is(discussType);//.andOperator(Criteria.where("availability").is(1));
		System.out.println("mongo template = " + mongoTemplate);
        return mongoTemplate.find(Query.query(criteria), Discuss.class);

	}
}