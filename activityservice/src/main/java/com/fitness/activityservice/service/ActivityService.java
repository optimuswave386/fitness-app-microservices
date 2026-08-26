package com.fitness.activityservice.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.fitness.activityservice.ActivityRepository;
import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import com.fitness.activityservice.model.Activity;

@Service
@Slf4j
@RequiredArgsConstructor()
public class ActivityService {
	
	private final ActivityRepository activityRepository;
	private final UserValidationService userValidationService;
	
	private final RabbitTemplate rabbitTemplate;
	
	@Value("${spring.rabbitmq.template.default-receive-queue}")
	private String queue;
	
	@Value("${spring.rabbitmq.template.exchange}")
	private String exchange;
	
	@Value("${spring.rabbitmq.template.routing-key}")
	private String routingkey;
		
	public ActivityResponse trackActivity(ActivityRequest request) {
		
		boolean isValidUser = userValidationService.validateUser(request.getUserId());
		
		if (!isValidUser) {
			throw new RuntimeException("Invalid User: "+ request.getUserId());
		}

		Activity activity = Activity.builder()
				.userId(request.getUserId())
				.type(request.getType())
				.duration(request.getDuration())
				.caloriesBurned(request.getCaloriesBurned())
				.startTime(request.getStartTime())
				.additionalMetrics(request.getAdditionalMetrics())
				.build();
				
		Activity savedActivity = activityRepository.save(activity);
		
		// publish to RabbitMQ for AI processing
		try {
			rabbitTemplate.convertAndSend(exchange, routingkey, savedActivity);
		} catch (Exception e) {
			log.error("Failed to publish to RabbitMQ: " + e);
		}
		
		return mapToResponse(savedActivity);
		
	}
	
	private ActivityResponse mapToResponse(Activity activity) {
		
		ActivityResponse activityResponse = new ActivityResponse();
		activityResponse.setId(activity.getId());
		activityResponse.setType(activity.getType());
		activityResponse.setDuration(activity.getDuration());
		activityResponse.setCaloriesBurned(activity.getCaloriesBurned());
		activityResponse.setStartTime(activity.getStartTime());
		activityResponse.setAdditionalMetrics(activity.getAdditionalMetrics());
		activityResponse.setCreatedAt(activity.getCreatedAt());
		activityResponse.setUpdatedAt(activity.getUpdatedAt());
		
		return activityResponse;
		
	}
	
	public List<ActivityResponse> getUserActivities(String userId) {
		List<Activity> activities = activityRepository.findByUserId(userId);
		return activities.stream()
				.map(this::mapToResponse)
				.collect(Collectors.toList());
	}
	
	public ActivityResponse getActivityById(String activityId) {
		return activityRepository.findById(activityId)
				.map(this::mapToResponse)
				.orElseThrow(()-> new RuntimeException("Activity not found with Id: " + activityId));
	}
	
}
