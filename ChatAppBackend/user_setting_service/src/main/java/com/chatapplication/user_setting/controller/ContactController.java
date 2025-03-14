package com.chatapplication.user_setting.controller;

import com.chatapplication.user_setting.dto.ContactAddReqDTO;
import com.chatapplication.user_setting.service.interfaces.IContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/contacts")
public class ContactController {
    @Autowired
    private IContactService contactService;

    // get contacts for the user
    @GetMapping("/")
    public ResponseEntity<?> getContacts() {
        return ResponseEntity.status(HttpStatus.OK).body(contactService.getContacts());
    }

    // add contact for the user
    @PostMapping("/addContact")
    public ResponseEntity<?> addContact(@RequestBody ContactAddReqDTO contactAddReqDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(contactService.addContact(contactAddReqDTO));
    }
}
