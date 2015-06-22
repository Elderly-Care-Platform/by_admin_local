package com.beautifulyears.rest;

import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.domain.Topic;
import com.beautifulyears.repository.TopicRepository;
import com.beautifulyears.rest.response.TopicResponse;

/**
 * The REST based service for managing "discuss"
 * 
 * @author jumpstart
 *
 */
@Controller
@RequestMapping({ "/topic" })
public class TopicController {

	private TopicRepository topicRepository;

	@Autowired
	public TopicController(TopicRepository topicRepository) {
		this.topicRepository = topicRepository;
	}

	@RequestMapping(method = { RequestMethod.GET }, value = "/list/all", produces = { "application/json" })
	@ResponseBody
	public Map<Integer, TopicResponse.TopicEntity> findAll() {
		TopicResponse res = new TopicResponse();
		List<Topic> list = this.topicRepository.findByIsActive(new Boolean(true));
		res.addTopics(list);
		return res.getResponse();
	}

	@RequestMapping(method = { RequestMethod.POST }, value = "/insertAll", consumes = { "application/json" })
	@ResponseBody
	public ResponseEntity<Void> insert(@RequestBody List<Topic> topicArray) {
		topicRepository.save(topicArray);
		ResponseEntity<Void> responseEntity = new ResponseEntity<Void>(
				HttpStatus.CREATED);
		return responseEntity;
	}

	@RequestMapping(method = { RequestMethod.POST }, value = "/linkAll", consumes = { "application/json" })
	@ResponseBody
	public ResponseEntity<Void> link(@RequestBody List<String> linksArray) {
		for (Iterator<String> iterator = linksArray.iterator(); iterator
				.hasNext();) {
			String linkString = (String) iterator.next();
			String parent = linkString.split(":")[0];
			String child = linkString.split(":")[1];

			if (null != parent && null != child) {

				Topic parentTopic = topicRepository.findByTopicName(parent);
				Topic childTopic = topicRepository.findByTopicName(child);

				if (null != parentTopic && null != childTopic) {
					parentTopic.getChildren().add(childTopic.getId());
					childTopic.setParentId(parentTopic.getId());

					topicRepository.save(parentTopic);
					topicRepository.save(childTopic);
				} else {
					System.out.println("mandatory parameters missing");
				}
			} else {
				System.out.println("No entry matched for the combination of "
						+ parent + "and " + child);
			}
		}

		ResponseEntity<Void> responseEntity = new ResponseEntity<Void>(
				HttpStatus.CREATED);
		return responseEntity;
	}

}
