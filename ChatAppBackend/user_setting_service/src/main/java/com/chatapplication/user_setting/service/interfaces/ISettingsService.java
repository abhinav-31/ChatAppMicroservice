package com.chatapplication.user_setting.service.interfaces;

import com.chatapplication.user_setting.dto.ApiResponse;

import java.util.Map;

public interface ISettingsService {
    Map<String, String> getUserSettings(Long userId);

    ApiResponse updateUserSettings(Long userId, Map<String, String> updatedSettings);
}
