package com.beautifulyears.repository;

import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.beautifulyears.domain.Topic;
import com.beautifulyears.repository.custom.TopicRepositoryCustom;

@Repository
public interface TopicRepository extends PagingAndSortingRepository<Topic, String>,TopicRepositoryCustom{

	public List<Topic> findAll();
	
	public Topic findByTopicName(String topicName);
	
	public List<Topic> findByIsActive(Boolean isActive);

}
