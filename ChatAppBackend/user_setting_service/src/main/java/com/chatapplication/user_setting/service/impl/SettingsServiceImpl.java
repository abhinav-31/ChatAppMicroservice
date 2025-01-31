package com.chatapplication.user_setting.service;

import com.chatapplication.user_setting.dto.ApiResponse;
import com.chatapplication.user_setting.entity.User;
import com.chatapplication.user_setting.exception.InvalidSettingsException;
import com.chatapplication.user_setting.exception.ResourceNotFoundException;
import com.chatapplication.user_setting.repository.UserRepository;
import com.chatapplication.user_setting.util.SettingsUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Set;

@Slf4j
@Service
@Transactional
public class SettingsServiceImpl implements ISettingsService{
    @Autowired
    UserRepository userRepository;

    @Override
    public Map<String, String> getUserSettings(Long userId) {
      User user =  userRepository.findById(userId).orElseThrow(()->new ResourceNotFoundException("User not found"));
      return user.getSettings().getSettingsMap();
    }

    @Override
    public ApiResponse updateUserSettings(Long userId, Map<String, String> updatedSettings) {
        User user = userRepository.findById(userId).orElseThrow(()->new ResourceNotFoundException("User not found"));
        // get stored settings
        Map<String, String> storedSettings = user.getSettings().getSettingsMap();

        for(Map.Entry<String, String> entry : updatedSettings.entrySet()){
            String key = entry.getKey();
            String value = entry.getValue();

            // validate the keys against keys in DEFAULT_SETTINGS
            if(!SettingsUtils.DEFAULT_SETTINGS.containsKey(key)){
                log.warn("Invalid setting key provided for user {}: {}", userId, key);
                throw new InvalidSettingsException("Invalid setting key: "+ key);
            }
            if (key.equals("privacy.phone_number_visibility") &&
                    !Set.of(SettingsUtils.EVERYONE, SettingsUtils.NOBODY, SettingsUtils.MY_CONTACTS, SettingsUtils.MY_CONTACTS_EXCEPT).contains(value)) {
                throw new InvalidSettingsException("Invalid value for phone number visibility: " + value);
            }

            // update the stored settings
            storedSettings.put(key, value);
        }
        // save the updated settings
        userRepository.save(user);
        log.info("User settings updated successfully for user {}: {}", userId, updatedSettings);
        return new ApiResponse("Your settings updated successfully",true);
    }
}
