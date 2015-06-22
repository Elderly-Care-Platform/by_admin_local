package com.beautifulyears.rest.response;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.beautifulyears.domain.Topic;
import com.beautifulyears.rest.response.TopicResponse.TopicEntity;

public class TopicResponse implements IResponse {

	private Map<String, TopicEntity> topicMap = new HashMap<String, TopicEntity>();

	private Map<Integer, TopicEntity> root;

	public class TopicEntity {
		private String id;
		private int orderIdx;
		private String name;
		private String slug;
		private String parentId;
		private int childCount;

		private Map<Integer, TopicEntity> children = new HashMap<Integer, TopicEntity>();

		public TopicEntity(Topic topic) {
			id = topic.getId();
			name = topic.getTopicName();
			slug = topic.getSlug();
			parentId = topic.getParentId();
			orderIdx = topic.getOrderIdx();
		}

		public int getOrderIdx() {
			return orderIdx;
		}

		public void setOrderIdx(int orderIdx) {
			this.orderIdx = orderIdx;
		}

		public String getParentId() {
			return parentId;
		}

		public void setParentId(String parentId) {
			this.parentId = parentId;
		}

		public String getId() {
			return id;
		}

		public void setId(String id) {
			this.id = id;
		}

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}

		public String getSlug() {
			return slug;
		}

		public void setSlug(String slug) {
			this.slug = slug;
		}

		public Map<Integer, TopicEntity> getChildren() {
			return children;
		}

		public void setChildren(Map<Integer, TopicEntity> children) {
			this.children = children;
		}

		public int getChildCount() {
			return childCount;
		}

		public void setChildCount(int childCount) {
			this.childCount = childCount;
		}

	}

	@Override
	public Map<Integer, TopicEntity> getResponse() {
		root = new HashMap<Integer, TopicEntity>();
		Iterator it = topicMap.entrySet().iterator();
		while (it.hasNext()) {
			Map.Entry pair = (Map.Entry) it.next();
			TopicEntity topic = (TopicEntity) pair.getValue();
			Map<Integer, TopicEntity> childMap = root;
			if (null != topic.getParentId()) {
				TopicEntity parentTopic = topicMap.get(topic.getParentId());

				childMap = parentTopic.getChildren();
				parentTopic.setChildCount(parentTopic.getChildCount() + 1);

			}
			childMap.put(topic.getOrderIdx(), topic);
		}
		return root;
	}

	public void addTopics(Topic topic) {
		TopicEntity topicRes = new TopicEntity(topic);
		topicMap.put(topic.getId(), topicRes);
	}

	public void addTopics(List<Topic> topicList) {
		for (Iterator<Topic> iterator = topicList.iterator(); iterator
				.hasNext();) {
			Topic topic = (Topic) iterator.next();
			TopicEntity topicRes = new TopicEntity(topic);
			topicMap.put(topic.getId(), topicRes);
		}
	}

}
