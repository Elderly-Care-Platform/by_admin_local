package com.beautifulyears.repository.custom;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.beautifulyears.domain.Topic;

public class TopicRepositoryImpl implements TopicRepositoryCustom {
	@Autowired
	private MongoTemplate mongoTemplate;

	@Override
	public List<String> getTopicNames(List<String> topicIds) {
		List <String> topicName = new ArrayList<String>();
		Query q = new Query();
		q.addCriteria(Criteria.where("id").in(topicIds));
		q.fields().include("topicName");
		List<Topic> topics = mongoTemplate.find(q, Topic.class);
		for (Topic topic : topics) {
			topicName.add(topic.getTopicName());
		}
		return topicName;
	}

}