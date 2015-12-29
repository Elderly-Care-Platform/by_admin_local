package com.beautifulyears.domain;

import java.util.List;

import org.springframework.data.mongodb.core.index.TextIndexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "linkDetails")
public class LinkInfo {
	private String url;
	@TextIndexed(weight=1)
	private String title;
	@TextIndexed(weight=2)
	private String description;
	private String mainImage;
	private List<String> otherImages;
	private List<String> tags;
	private int type;
	private String embeddedVideo;
	private String videoThumbnail;
	private String domainName;
	
	
	
	public String getDomainName() {
		return domainName;
	}

	public void setDomainName(String domainName) {
		this.domainName = domainName;
	}

	public String getVideoThumbnail() {
		return videoThumbnail;
	}

	public void setVideoThumbnail(String videoThumbnail) {
		this.videoThumbnail = videoThumbnail;
	}

	public String getEmbeddedVideo() {
		return embeddedVideo;
	}

	public void setEmbeddedVideo(String embeddedVideo) {
		this.embeddedVideo = embeddedVideo;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getMainImage() {
		return mainImage;
	}

	public void setMainImage(String mainImage) {
		this.mainImage = mainImage;
	}

	public List<String> getOtherImages() {
		return otherImages;
	}

	public void setOtherImages(List<String> otherImages) {
		this.otherImages = otherImages;
	}

	public List<String> getTags() {
		return tags;
	}

	public void setTags(List<String> tags) {
		this.tags = tags;
	}

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

}
