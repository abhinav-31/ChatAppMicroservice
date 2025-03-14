package com.chatapplication.chat_notification.controller;

import com.chatapplication.chat_notification.dto.DeleteGroupInstByMemDTO;
import com.chatapplication.chat_notification.dto.GroupChatAddMemReqDTO;
import com.chatapplication.chat_notification.dto.GroupChatCreateReqDTO;
import com.chatapplication.chat_notification.dto.GroupChatRemoveMemberReqDTO;
import com.chatapplication.chat_notification.service.interfaces.IGroupChatService;
import com.chatapplication.chat_notification.service.interfaces.IMessageService;
import com.chatapplication.chat_notification.service.interfaces.INotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/group-chat")
public class GroupChatController {

    @Autowired
    private IGroupChatService groupChatService;
    @Autowired
    private INotificationService notificationService;
    @Autowired
    private IMessageService messageService;

    // Create Group
    @PostMapping("/create")
    public ResponseEntity<?> createGroupChat(@RequestBody GroupChatCreateReqDTO groupChatDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(groupChatService.createGroupChat(groupChatDTO));
    }

    // Only admin can add the members to the group
    @PostMapping("/add-members")
    public ResponseEntity<?> addMembersToGroup(@RequestBody GroupChatAddMemReqDTO groupChatAddMemReqDTO) {
        return ResponseEntity.status(HttpStatus.OK).body(groupChatService.addMembersToGroup(groupChatAddMemReqDTO));
    }

    // Only admin can remove the members from the group
    @PostMapping("/remove-members")
    public ResponseEntity<?> removeMembersFromGroup(@RequestBody GroupChatRemoveMemberReqDTO groupChatRemoReqDTO) {
        return ResponseEntity.status(HttpStatus.OK).body(groupChatService.removeMembersFromGroup(groupChatRemoReqDTO));
    }

    // Delete group chat instance by members
    @PostMapping("/delete-group-instance")
    public ResponseEntity<?> deleteGroupInstanceByMember(@RequestBody DeleteGroupInstByMemDTO deleteGroupInstByMemDTO) {
        groupChatService.deleteGroupChatInstanceByMembers(deleteGroupInstByMemDTO);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    // Only admin can delete the complete group
    @PostMapping("/delete-group/{groupId}")
    public ResponseEntity<?> deleteGroup(@PathVariable String groupId) {
        return ResponseEntity.status(HttpStatus.OK).body(groupChatService.deleteGroup(groupId));
    }

    @GetMapping("/getGroupChat/{userId}")
    public ResponseEntity<?> getGroupChatForUser(@PathVariable String userId) {
        return ResponseEntity.status(HttpStatus.OK).body(groupChatService.getGroupChat(userId));
    }
}
