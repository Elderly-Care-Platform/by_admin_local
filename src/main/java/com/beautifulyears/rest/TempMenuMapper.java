/**
 * 
 */
package com.beautifulyears.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.domain.Discuss;
import com.beautifulyears.repository.DiscussRepository;

/**
 * @author Nitin
 *
 */
@Controller
@RequestMapping({ "/changeOfDiscussMapping" })
public class TempMenuMapper {

	private DiscussRepository discussRepository;
	private MongoTemplate mongoTemplate;

	@Autowired
	public TempMenuMapper(DiscussRepository discussRepository,
			MongoTemplate mongoTemplate) {
		super();
		this.discussRepository = discussRepository;
		this.mongoTemplate = mongoTemplate;
	}

	@RequestMapping(method = { RequestMethod.GET }, produces = { "application/json" }, value = { "" })
	@ResponseBody
	public Object changeOfDiscussMapping() {
		System.out.println("entered mapping-----------------------------------------------------------------------------------");
		List<Discuss> discussList = discussRepository.findAll();
		for (Discuss discuss : discussList) {
			
		}
		return null;
	}
}
