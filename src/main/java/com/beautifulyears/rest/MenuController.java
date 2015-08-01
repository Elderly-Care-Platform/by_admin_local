package com.beautifulyears.rest;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Controller;
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

	@RequestMapping(method = { RequestMethod.DELETE }, value = { "" })
	@ResponseBody
	public Object deleteMenu(
			@RequestParam(value = "id", required = true) String id) {
		Menu oldmenu = null;
		if (null != id) {
			Query q = new Query();
			q.addCriteria(Criteria.where("id").is(id));
			oldmenu = mongoTemplate.findAndRemove(q, Menu.class);
			for (Menu childMenu : oldmenu.getChildren()) {
				mongoTemplate.remove(childMenu);
			}
		}
		if (oldmenu != null) {
			Query q = new Query();
			q.addCriteria(Criteria.where("id").is(oldmenu.getParentMenuId()));
			Menu parentMenu = mongoTemplate.findOne(q, Menu.class);
			parentMenu.getChildren().remove(oldmenu.getId());
			mongoTemplate.save(parentMenu);
		}
		return null;
	}

	@RequestMapping(method = { RequestMethod.POST }, consumes = { "application/json" }, value = { "" })
	@ResponseBody
	public Object addMenu(@RequestBody Menu menu, HttpServletRequest req,
			HttpServletResponse res) {
		Menu oldmenu = null;

		try {
			if (null != menu.getId()) {
				Query q = new Query();
				q.addCriteria(Criteria.where("id").is(menu.getId()));
				oldmenu = mongoTemplate.findOne(q, Menu.class);
				
			}
			if (oldmenu == null) {
				oldmenu = new Menu();
			}
			if (!checkOrderIdx(menu)) {
				res.setStatus(404);
				return new Exception(
						"Oder index is already used for another menu.");
			}
			if (oldmenu.getParentMenuId() != null) {
				Menu oldParent = mongoTemplate.findById(
						oldmenu.getParentMenuId(), Menu.class);
				if (oldParent.getChildren().contains(oldmenu)) {
					oldParent.getChildren().remove(oldmenu);
					mongoTemplate.save(oldParent);
				}
			}
			oldmenu.setChildren(menu.getChildren());
			oldmenu.setOrderIdx(menu.getOrderIdx());
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
					addAncestors(oldmenu, parent);
					parent.getChildren().remove(oldmenu);
					int index = oldmenu.getOrderIdx() > parent.getChildren()
							.size() ? parent.getChildren().size() : oldmenu
							.getOrderIdx();
					parent.getChildren().add(index, oldmenu);
					if (index != oldmenu.getOrderIdx()) {
						oldmenu.setOrderIdx(index);
						mongoTemplate.save(oldmenu);
					}

					mongoTemplate.save(parent);
				}
			} else {
				mongoTemplate.save(oldmenu);
			}

		} catch (Exception e) {
			res.setStatus(404);
			return new Exception("internal server error");
		}

		return oldmenu;
	}

	private boolean checkOrderIdx(Menu menu) {
		boolean isValid = true;
		Query q = new Query();
		q.addCriteria(Criteria.where("orderIdx").is(menu.getOrderIdx())
				.and("parentMenuId").is(menu.getParentMenuId()).and("id")
				.ne(menu.getId()));
		long count = mongoTemplate.count(q, Menu.class);
		if (count > 0) {
			isValid = false;
		}
		return isValid;

	}

	private void addAncestors(Menu child, Menu parent) {
		child.setAncestorIds(new ArrayList<String>());
		child.getAncestorIds().addAll(parent.getAncestorIds());
		child.getAncestorIds().add(parent.getId());
		mongoTemplate.save(child);
		for (Menu menu : child.getChildren()) {
			menu.setAncestorIds(new ArrayList<String>());
			menu.getAncestorIds().addAll(child.getAncestorIds());
			menu.getAncestorIds().add(child.getId());
			mongoTemplate.save(menu);
			addAncestors(menu, child);
		}
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
			if ("root".equals(parentId.toString())) {
				parentId = null;
			}
			q.addCriteria(Criteria.where("parentMenuId").is(parentId));
			q.with(new Sort(Sort.Direction.ASC, "orderIdx"));
		}

		List<Menu> menus = this.mongoTemplate.find(q, Menu.class);
		return menus;
	}

	private String getSlugFromTags(List<Tag> tags) {
		StringBuilder slug = new StringBuilder("");
		for (Tag tag : tags) {
			slug.append(tag.getName().replace(' ', '_'));
			slug.append("_");
		}

		return slug.toString();
	}

}
