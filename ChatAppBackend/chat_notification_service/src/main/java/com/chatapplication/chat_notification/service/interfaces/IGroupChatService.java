package com.chatapplication.chat_notification.service.interfaces;

import com.chatapplication.chat_notification.dto.*;

import java.util.List;

public interface IGroupChatService {
    GroupChatCreateResDTO createGroupChat(GroupChatCreateReqDTO group);

    Boolean addMembersToGroup(GroupChatAddMemReqDTO groupChatAddMemReqDTO);

    Boolean removeMembersFromGroup(GroupChatRemoveMemberReqDTO groupChatRemoReqDTO);

    void deleteGroupChatInstanceByMembers(DeleteGroupInstByMemDTO deleteGroupInstByMemDTO);

    List<ChatResponseDTO> getGroupChatForUsers(String userId);

    String deleteGroup(String groupId);
}
