package com.beautifulyears.rest;

import java.util.Calendar;
import java.util.Date;
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
import com.beautifulyears.domain.User;
import com.beautifulyears.rest.response.BYGenericResponseHandler;
import com.beautifulyears.rest.response.PageImpl;
import com.beautifulyears.util.StatsHandler;
import com.beautifulyears.util.Util;

@Controller
@RequestMapping({ "/activityLog" })
public class ActivityLogController {

	private MongoTemplate mongoTemplate;

	@Autowired
	public ActivityLogController(MongoTemplate mongoTemplate) {
		this.mongoTemplate = mongoTemplate;
		StatsHandler statsHandler = new StatsHandler(
				mongoTemplate);
		new Thread(statsHandler).start();
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/page" }, produces = { "application/json" })
	@ResponseBody
	public Object getPage(
			@RequestParam(value = "sort", required = false, defaultValue = "activityTime") String sort,
			@RequestParam(value = "dir", required = false, defaultValue = "0") int dir,
			@RequestParam(value = "p", required = false, defaultValue = "0") int pageIndex,
			@RequestParam(value = "s", required = false, defaultValue = "10") int pageSize,
			@RequestParam(value = "readStatus", required = false) int readStatus,
			@RequestParam(value = "activityTypeFilter", required = false) List<Integer> activityTypeFilter,
			@RequestParam(value = "startDate", required = false) long startDate,
			@RequestParam(value = "endDate", required = false) long endDate,
			HttpServletRequest request) throws Exception {
		@SuppressWarnings("unused")
		User currentUser = Util.getSessionUser(request);
		StatsHandler statsHandler = new StatsHandler(
				mongoTemplate);
		new Thread(statsHandler).start();

		Boolean isRead = null;
		if (readStatus == 1) {
			isRead = true;
		} else if (readStatus == 2) {
			isRead = false;
		}

		Calendar cal = Calendar.getInstance();
		cal.setTime(new Date(startDate));
		cal.set(Calendar.HOUR_OF_DAY, 0);
		cal.set(Calendar.MINUTE, 0);
		cal.set(Calendar.SECOND, 0);
		cal.set(Calendar.MILLISECOND, 0);
		Date startDate1 = cal.getTime();

		cal.setTime(new Date(endDate));
		cal.set(Calendar.HOUR_OF_DAY, 23);
		cal.set(Calendar.MINUTE, 59);
		cal.set(Calendar.SECOND, 59);
		cal.set(Calendar.MILLISECOND, 999);
		Date endDate1 = cal.getTime();

		Direction sortDirection = Direction.DESC;
		if (dir != 0) {
			sortDirection = Direction.ASC;
		}

		Pageable pageable = new PageRequest(pageIndex, pageSize, sortDirection,
				sort);
		Query query = new Query();
		query.with(pageable);
		if (isRead != null) {
			query.addCriteria(Criteria.where("isRead").is(isRead));
		}
		if (activityTypeFilter != null && activityTypeFilter.get(0) != 0) {
			query.addCriteria(Criteria.where((String) "activityType").in(
					activityTypeFilter));
//			query.addCriteria(Criteria.where("activityType").is(activityTypeFilter));
		}
		if (null != endDate1 && null != startDate1) {
//			query.addCriteria(Criteria.where("activityTime").gte(startDate1)
//					.andOperator(Criteria.where("activityTime").lte(endDate1)));
			Criteria criteria = Criteria.where("activityTime").lte(endDate1).gte(startDate1);
			query.addCriteria(criteria);
			
		}
		List<ActivityLog> logs = this.mongoTemplate.find(query,
				ActivityLog.class);
		long total = this.mongoTemplate.count(query, ActivityLog.class);
		PageImpl<ActivityLog> storyPage = new PageImpl<ActivityLog>(logs,
				pageable, total);
		return BYGenericResponseHandler.getResponse(storyPage);
	}

	@RequestMapping(method = { RequestMethod.POST }, value = { "/markAsRead" }, consumes = { "application/json" })
	@ResponseBody
	public Object markAsRead(@RequestBody ActivityLog activityLog,
			HttpServletRequest request) throws Exception {
		@SuppressWarnings("unused")
		User currentUser = Util.getSessionUser(request);
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(activityLog.getId()));
		ActivityLog log = mongoTemplate.findOne(q, ActivityLog.class);
		if (null != log) {
			log.setRead(activityLog.isRead());
			mongoTemplate.save(log);
		}
		return BYGenericResponseHandler.getResponse(log);
	}
	
	@RequestMapping(method = { RequestMethod.GET }, value = { "/getStats" }, produces = { "application/json" })
	@ResponseBody
	public Object getStats(HttpServletRequest request) throws Exception{
		StatsHandler statsHandler = new StatsHandler(
				mongoTemplate);
		new Thread(statsHandler).start();
		return BYGenericResponseHandler.getResponse(StatsHandler.countMap);
	}

}
