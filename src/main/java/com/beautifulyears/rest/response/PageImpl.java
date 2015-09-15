package com.beautifulyears.rest.response;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Pageable;

public class PageImpl<T> {
	private List<T> content = new ArrayList<T>();
	private boolean lastPage = false;
	private long number;
	private long size;
	private long total;

	public PageImpl(List<T> content, Pageable pageable, long total) {
		this.content = content;
		this.number = pageable.getPageNumber();
		this.size = pageable.getPageSize();
		if (((pageable.getPageNumber() + 1) * pageable.getPageSize()) > total) {
			lastPage = true;
		}
		this.total = total;
	}

	public long getTotal() {
		return total;
	}

	public void setTotal(long total) {
		this.total = total;
	}

	public long getSize() {
		return size;
	}

	public void setSize(long size) {
		this.size = size;
	}

	public List<T> getContent() {
		return content;
	}

	public void setContent(List<T> content) {
		this.content = content;
	}

	public boolean isLastPage() {
		return lastPage;
	}

	public void setLastPage(boolean lastPage) {
		this.lastPage = lastPage;
	}

	public long getNumber() {
		return number;
	}

	public void setNumber(long number) {
		this.number = number;
	}

}
