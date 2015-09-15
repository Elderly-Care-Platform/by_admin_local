package com.beautifulyears.rest;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.domain.ActivityLog;
import com.beautifulyears.rest.response.PageImpl;

@Controller
@RequestMapping({ "/activityLog" })
public class ActivityLogController {

	private MongoTemplate mongoTemplate;

	@Autowired
	public ActivityLogController(MongoTemplate mongoTemplate) {
		this.mongoTemplate = mongoTemplate;
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/page" }, produces = { "application/json" })
	@ResponseBody
	public Object getPage(
			@RequestParam(value = "sort", required = false, defaultValue = "activityTime") String sort,
			@RequestParam(value = "dir", required = false, defaultValue = "0") int dir,
			@RequestParam(value = "p", required = false, defaultValue = "0") int pageIndex,
			@RequestParam(value = "s", required = false, defaultValue = "10") int pageSize,
			HttpServletRequest request) throws Exception {
		Direction sortDirection = Direction.DESC;
		if (dir != 0) {
			sortDirection = Direction.ASC;
		}

		Pageable pageable = new PageRequest(pageIndex, pageSize, sortDirection,
				sort);
		Query query = new Query();
		query.with(pageable);
		List<ActivityLog> logs = this.mongoTemplate.find(query,
				ActivityLog.class);
		long total = this.mongoTemplate.count(query, ActivityLog.class);
		PageImpl<ActivityLog> storyPage = new PageImpl<ActivityLog>(logs,
				pageable, total);
		return storyPage;
	}

	@RequestMapping(method = { RequestMethod.POST }, value = { "/markAsRead" }, consumes = { "application/json" })
	@ResponseBody
	public Object markAsRead(
			@RequestBody ActivityLog activityLog,
			HttpServletRequest request) throws Exception {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(activityLog.getId()));
		ActivityLog log = mongoTemplate.findOne(q, ActivityLog.class);
		if (null != log) {
			log.setRead(activityLog.isRead());
			mongoTemplate.save(log);
		}
		return log;
	}

}
