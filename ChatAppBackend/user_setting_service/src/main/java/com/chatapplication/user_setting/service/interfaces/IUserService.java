package com.chatapplication.user_setting.service.impl;

import com.chatapplication.user_setting.dto.SaveUserReqDTO;
import com.chatapplication.user_setting.dto.UserDataResponseDTO;
import jakarta.servlet.http.HttpServletRequest;

public interface IUserService {
    String saveUser(SaveUserReqDTO saveUserReqDTO, HttpServletRequest request);
    UserDataResponseDTO getUser();
    String updateUser(SaveUserReqDTO updateRequestDTO);
    void updateUserLastSeen();
}
