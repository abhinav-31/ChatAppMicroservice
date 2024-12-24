package com.chatapplication.user_setting.service;

import com.chatapplication.user_setting.dto.ApiResponse;
import com.chatapplication.user_setting.dto.ContactReponseDTO;
import com.chatapplication.user_setting.entity.User;

import java.util.List;

public interface IContactService {
    List<ContactReponseDTO> getContacts(Long userId);
    ApiResponse addContact(Long userId, Long contactId);
}
