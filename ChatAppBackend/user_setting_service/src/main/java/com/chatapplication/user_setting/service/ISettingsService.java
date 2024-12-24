package com.chatapplication.user_setting.service;

import com.chatapplication.user_setting.dto.ApiResponse;
import com.chatapplication.user_setting.entity.User;

import java.util.Map;

public interface ISettingsService {
    Map<String, String> getUserSettings(Long userId);
    ApiResponse updateUserSettings(Long userId, Map<String, String> updatedSettings);
}
