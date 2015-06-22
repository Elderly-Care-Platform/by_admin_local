package com.beautifulyears.repository;

import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.beautifulyears.domain.Topic;

@Repository
public interface TopicRepository extends PagingAndSortingRepository<Topic, String>{

	public List<Topic> findAll();
	
	public Topic findByTopicName(String topicName);
	
	public List<Topic> findByIsActive(Boolean isActive);

}
