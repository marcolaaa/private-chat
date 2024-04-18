package com.marcos.privatechat.chat;

import com.marcos.privatechat.chatroom.ChatRoomService;
import com.marcos.privatechat.exception.ChatNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatMessageService {

    private final ChatMessageRepository repository;
    private final ChatRoomService chatRoomService;

    public ChatMessage save(ChatMessage chatMessage) {
        var chatId = chatRoomService.getChatRoomId(chatMessage.getSenderId(),
                chatMessage.getRecipientId(), true).orElseThrow(ChatNotFoundException::new);
        chatMessage.setChatId(chatId);
        repository.save(chatMessage);
        return chatMessage;
    }

    public List<ChatMessage> findChatMessages (String senderId, String recipientId) {
        //flag is passed as false because we only want to get the existent ones
        var chatId = chatRoomService.getChatRoomId(senderId, recipientId, false);

        return chatId.map(repository::findByChatId).orElse(new ArrayList<>());
    }
}
