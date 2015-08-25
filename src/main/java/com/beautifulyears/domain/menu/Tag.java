/**
 * 
 */
package com.beautifulyears.domain.menu;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * @author Nitin
 *
 */
@Document(collection = "tag")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Tag {
	
	public final static int TAG_TYPE_SYSTEM = 0;
	public final static int TAG_TYPE_USER = 1;
	
	@Id
	private String id;
	private int type = TAG_TYPE_SYSTEM;
	@Indexed(unique = true)
	private String name;
	private String description;
	

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}
	
	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
	
	@Override
	public boolean equals(Object object) {
		boolean isEqual = false;

		if (object != null && object instanceof Tag) {
			isEqual = (this.getId().equals(((Tag) object).getId()));
		}
		return isEqual;
	}

}
