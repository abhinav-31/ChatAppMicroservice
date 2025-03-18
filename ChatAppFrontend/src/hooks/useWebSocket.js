import { Client } from "@stomp/stompjs";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import SockJS from "sockjs-client";

const useWebSocket = (
	senderId,
	url,
	onMessage,
	incomingMessageStatus,
	incomingGroupNotification,
	incomingGroupMessage,
	topics = []
) => {
	const [stompClient, setStompClient] = useState(null);
	const [isConnected, setIsConnected] = useState(false);
	const subscriptionsRef = useRef(new Map()); // Store topic → subscription mapping
	const onMessageRef = useRef(onMessage);
	const incomingMessageStatusRef = useRef(incomingMessageStatus);
	const incomingGroupNotificationRef = useRef(incomingGroupNotification);
	const incomingGroupMessageRef = useRef(incomingGroupMessage);

	useEffect(() => {
		onMessageRef.current = onMessage;
	}, [onMessage]);

	useEffect(() => {
		incomingMessageStatusRef.current = incomingMessageStatus;
	}, [incomingMessageStatus]);

	useEffect(() => {
		incomingGroupNotificationRef.current = incomingGroupNotification;
	}, [incomingGroupNotification]);

	useEffect(() => {
		incomingGroupMessageRef.current = incomingGroupMessage;
	}, [incomingGroupMessage]);

	// Establish WebSocket connection
	useEffect(() => {
		if (!senderId) return;
		const connect = () => {
			const socket = new SockJS(`${url}`);
			const client = new Client({
				webSocketFactory: () => socket,
				reconnectDelay: 2000,
				heartbeatIncoming: 0,
				heartbeatOutgoing: 5000,
				debug: (str) => console.debug("WebSocket Log:", str),

				onConnect: () => {
					setIsConnected(true);
					client.reconnectDelay = 2000;
					// Subscribe to initial topics
					topics.forEach((topic) => subscribeToTopic(client, topic));

					setStompClient(client);
				},

				onDisconnect: () => {
					setIsConnected(false);
					unsubscribeAll();
				},

				onStompError: () => {
					client.reconnectDelay = 2000;
				},
			});

			client.activate();
		};

		connect();

		return () => {
			if (stompClient) {
				stompClient.deactivate().then(() => {
					console.log("WebSocket Disconnected");
				});
			}
			unsubscribeAll();
		};
	}, [senderId]);

	// Function to subscribe to a new topic
	const subscribeToTopic = (client, topic) => {
		if (!subscriptionsRef.current.has(topic)) {
			const subscription = client.subscribe(topic, (message) => {
				const parsedMessage = JSON.parse(message.body);

				if (topic.includes("/status")) {
					incomingMessageStatusRef.current?.(topic, parsedMessage); // Handle status updates
				}
				if (topic.includes(`/queue/${senderId}`)) {
					onMessageRef.current?.(topic, parsedMessage);
				}
				if (topic.includes(`/queue/group-add`)) {
					incomingGroupNotificationRef.current?.(
						topic,
						parsedMessage
					);
				}
				if (topic.includes("/topic/group-")) {
					incomingGroupMessageRef.current?.(topic, parsedMessage);
				}
			});
			subscriptionsRef.current.set(topic, subscription);
		}
	};

	// Function to unsubscribe from all topics
	const unsubscribeAll = () => {
		if (subscriptionsRef.current.size > 0) {
			subscriptionsRef.current.forEach((subscription) => {
				subscription.unsubscribe();
			});
			subscriptionsRef.current.clear();
		}
	};

	// Handle topic changes dynamically without reconnecting WebSocket
	useEffect(() => {
		if (stompClient?.connected) {
			topics.forEach((topic) => subscribeToTopic(stompClient, topic));
		}
	}, [topics, stompClient]);

	// Function to send messages
	const sendMessage = useCallback(
		(destination, body) => {
			if (stompClient?.connected) {
				stompClient.publish({
					destination,
					body: JSON.stringify(body),
				});
			} else {
				toast.error("No WebSocket connection, message not sent");
			}
		},
		[stompClient]
	);

	// Funtion to send group notification
	const sendGroupNotification = useCallback(
		(destination, body) => {
			if (stompClient?.connected) {
				stompClient.publish({
					destination,
					body: JSON.stringify(body),
				});
			} else {
				toast.error("No WebSocket connection, notification not sent");
			}
		},
		[stompClient]
	);

	return [sendGroupNotification, sendMessage, isConnected];
};

export default useWebSocket;