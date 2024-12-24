package com.chatapplication.user_setting.controller;

import com.chatapplication.user_setting.service.IContactService;
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
    @GetMapping("/{userId}")
    public ResponseEntity<?> getContacts(@PathVariable Long userId) {
        return ResponseEntity.status(HttpStatus.FOUND).body(contactService.getContacts(userId));
    }

    // add contact for the user
    @PostMapping("/addContact/{userId}/{contactId}")
    public ResponseEntity<?> addContact(@PathVariable Long userId, @PathVariable Long contactId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(contactService.addContact(userId, contactId));
    }
}
