package sc.backend.services;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sc.backend.dtos.req.EditRoomDTO;
import sc.backend.dtos.req.CreateRoomDTO;
import sc.backend.dtos.res.RoomDTO;
import sc.backend.entities.Room;
import sc.backend.entities.User;
import sc.backend.repositories.RoomRepository;
import sc.backend.repositories.UserRepository;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Transactional
@RequiredArgsConstructor
@Service
public class RoomService {

    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    public RoomDTO createRoom(CreateRoomDTO createRoomDTO, String authenticatedEmail) {
        User creator = userService.getUserByEmail(userRepository.findByEmail(authenticatedEmail));

        Room room = Room.builder()
                .name(createRoomDTO.getName())
                .createdBy(creator)
                .build();

        Set<User> members = convertIdsToUsers(createRoomDTO.getUserIdSet());
        room.setUserList(members);
        roomRepository.save(room);

        return convertToDTO(room);
    }

    public RoomDTO getRoom(int roomId) {
        Room room = findRoomById(roomId);

        return convertToDTO(room);
    }

    public List<RoomDTO> getAllRooms() {
        List<RoomDTO> roomDTOList = new ArrayList<>();

        for (Room room : roomRepository.findAll()) {
            roomDTOList.add(convertToDTO(room));
        }

        return roomDTOList;
    }

    public RoomDTO editRoom(int roomId, EditRoomDTO editRoomDTO) {
        Room room = findRoomById(roomId);
        if (!room.getName().equals(editRoomDTO.getName())) {
            room.setName(editRoomDTO.getName());
        }

        Set<User> members = convertIdsToUsers(editRoomDTO.getUserIdSet());
        room.setUserList(members);
        roomRepository.save(room);

        return convertToDTO(room);
    }

    public void deleteRoom(int roomId) {
        Room room = findRoomById(roomId);

        roomRepository.delete(room);
    }

    public Set<User> convertIdsToUsers(Set<Integer> userIdSet) {
        Set<User> users = new HashSet<>();

        for (Integer userId : userIdSet) {
            User user = userService.findUserById(userId);
            users.add(user);
        }

        return users;
    }

    public Room findRoomById(int roomId) {
        return roomRepository.findById(roomId).orElseThrow(() ->
                new EntityNotFoundException("Room not found"));
    }

    public int[] getUserList(Room room) {
        int[] userArray = new int[room.getUserList().size()];
        Object[] userList = room.getUserList().toArray();

        for (int i = 0; i < userList.length; i++) {
            userArray[i] = (int) userList[i];
        }

        return userArray;
    }

    public RoomDTO convertToDTO(Room room) {
        return RoomDTO.builder()
                .roomId(room.getRoomId())
                .name(room.getName())
                .createdBy(room.getCreatedBy().getUserId())
                .userList(getUserList(room))
                .build();
    }
}
