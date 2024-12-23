package com.chatapplication.user_setting.service;

import com.chatapplication.user_setting.dto.SaveUserReqDTO;
import jakarta.servlet.http.HttpServletRequest;

public interface IUserService {
    String saveUser(SaveUserReqDTO saveUserReqDTO, HttpServletRequest request);
}
