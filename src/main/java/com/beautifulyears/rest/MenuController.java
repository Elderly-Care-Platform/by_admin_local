package com.beautifulyears.rest;

import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.domain.menu.Menu;
import com.beautifulyears.domain.menu.Tag;

@Controller
@RequestMapping({ "/menu" })
public class MenuController {

	private MongoTemplate mongoTemplate;

	@Autowired
	public MenuController(MongoTemplate mongoTemplate) {
		this.mongoTemplate = mongoTemplate;
	}

	@RequestMapping(method = { RequestMethod.GET }, produces = { "application/json" }, value = { "/tag" })
	@ResponseBody
	public Object getTags() {
		List<Tag> menus = this.mongoTemplate.findAll(Tag.class);
		return menus;
	}

	@RequestMapping(method = { RequestMethod.POST }, consumes = { "application/json" }, value = { "/tag" })
	@ResponseBody
	public Object addTag(@RequestBody Tag tag) {
		Tag oldTag = null;
		if (null != tag.getId()) {
			Query q = new Query();
			q.addCriteria(Criteria.where("id").is(tag.getId()));
			oldTag = mongoTemplate.findOne(q, Tag.class);
		}
		if (oldTag == null) {
			oldTag = new Tag();
		}
		oldTag.setName(tag.getName());
		oldTag.setType(tag.getType());
		oldTag.setDescription(tag.getDescription());
		mongoTemplate.save(oldTag);
		return oldTag;
	}

	@RequestMapping(method = { RequestMethod.POST }, consumes = { "application/json" }, value = { "" })
	@ResponseBody
	public Object addMenu(@RequestBody Menu menu) {

		Menu oldmenu = null;
		if (null != menu.getId()) {
			Query q = new Query();
			q.addCriteria(Criteria.where("id").is(menu.getId()));
			oldmenu = mongoTemplate.findOne(q, Menu.class);
		}
		if (oldmenu == null) {
			oldmenu = new Menu();
		}
		oldmenu.setAncestorIds(menu.getAncestorIds());
		oldmenu.setChildren(menu.getChildren());
		oldmenu.setDisplayMenuName(menu.getDisplayMenuName());
		oldmenu.setLinkedMenuId(menu.getLinkedMenuId());
		oldmenu.setModule(menu.getModule());
		oldmenu.setParentMenuId(menu.getParentMenuId());
		oldmenu.setTags(menu.getTags());
		oldmenu.setSlug(getSlugFromTags(oldmenu.getTags()));

		if (oldmenu.getParentMenuId() != null) {
			Menu parent = mongoTemplate.findById(oldmenu.getParentMenuId(),
					Menu.class);
			if (parent != null) {
				oldmenu.setAncestorIds(new ArrayList<String>());
				oldmenu.getAncestorIds().addAll(parent.getAncestorIds());
				oldmenu.getAncestorIds().add(parent.getId());
				mongoTemplate.save(oldmenu);
				if (!parent.getChildren().contains(oldmenu)) {
					parent.getChildren().add(oldmenu);
					mongoTemplate.save(parent);
				}
			}
		} else {
			mongoTemplate.save(oldmenu);
		}
		return oldmenu;
	}

	@RequestMapping(method = { RequestMethod.GET }, produces = { "application/json" }, value = { "getMenuById" })
	@ResponseBody
	public Object getMenuById(
			@RequestParam(value = "id", required = true) String id) {
		Menu menu = this.mongoTemplate.findById(id, Menu.class);
		return menu;
	}
	
	
	@RequestMapping(method = { RequestMethod.GET }, produces = { "application/json" }, value = { "getMenu" })
	@ResponseBody
	public Object getMenu(
			@RequestParam(value = "id", required = false) String id,
			@RequestParam(value = "parentId", required = false) String parentId) {
		Query q = new Query();
		if (null != id) {
			q.addCriteria(Criteria.where("id").is(new ObjectId(id)));
		}
		if (null != parentId) {
			if("root".equals(parentId.toString())){
				parentId = null;
			}
			q.addCriteria(Criteria.where("parentMenuId").is(parentId));
		}

		List<Menu> menus = this.mongoTemplate.find(q, Menu.class);
		return menus;
	}
	
	private String getSlugFromTags(List<Tag> tags){
		StringBuilder slug = new StringBuilder("");
		for (Tag tag : tags) {
			slug.append(tag.getName().replace(' ', '_'));
			slug.append("_");
		}
		
		return slug.toString();
	}

}
