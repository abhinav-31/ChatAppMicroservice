package com.chatapplication.user_setting;

import com.chatapplication.user_setting.config.TwilioConfig;
import com.twilio.Twilio;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class UserSettingServiceApplication {

	@Autowired
	private TwilioConfig twilioConfig;

	@PostConstruct
	public void intiTwilio(){
		Twilio.init(twilioConfig.getAccountSid(),twilioConfig.getAuthToken());
	}

	public static void main(String[] args) {
		SpringApplication.run(UserSettingServiceApplication.class, args);
	}

}
