package com.chatapplication.user_setting.controller;

import com.chatapplication.user_setting.service.ISettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/settings")
public class SettingsController {
    @Autowired
    private ISettingsService settingsService;

    // get user settings
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserSettings(@PathVariable Long userId){
        return ResponseEntity.status(HttpStatus.FOUND).body(settingsService.getUserSettings(userId));
    }
    // update user settings
    @PostMapping("/update_settings/{userId}")
    public ResponseEntity<?> updateUserSettings(@PathVariable Long userId, Map<String,String> updateSetting){
        return ResponseEntity.status(HttpStatus.OK).body(settingsService.updateUserSettings(userId,updateSetting));
    }

}
