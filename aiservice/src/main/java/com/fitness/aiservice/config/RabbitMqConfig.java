package com.fitness.aiservice.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
public class RabbitMqConfig {

	@Value("${spring.rabbitmq.template.default-receive-queue}")
	private String queue;
	
	@Value("${spring.rabbitmq.template.exchange}")
	private String exchange;
	
	@Value("${spring.rabbitmq.template.routing-key}")
	private String routingkey;
	
	@Bean Queue activityQueue() {
		return new Queue(queue, true);
	}
	
	@Bean DirectExchange activityExchange() {
		return new DirectExchange(exchange);
	}
	
	@Bean Binding activityBinding(Queue activityQueue, DirectExchange activityExchange) {
		// log.error("the rabbitmq exchange is " + exchange);
		return BindingBuilder.bind(activityQueue).to(activityExchange).with(routingkey);
	}
	
	@Bean MessageConverter jsonMessageConverter() {
		return new Jackson2JsonMessageConverter();
	}
	
}