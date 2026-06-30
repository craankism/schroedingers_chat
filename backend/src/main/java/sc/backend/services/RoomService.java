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

        roomRepository.save(room);
        creator.getCreatedRoomList().add(room);
        userRepository.save(creator);

        return addUsersToRoom(room, createRoomDTO.getUserIdSet());
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
            roomRepository.save(room);
        }

        return addUsersToRoom(room, editRoomDTO.getUserIdSet());
    }

    public void deleteRoom(int roomId) {
        Room room = findRoomById(roomId);

        roomRepository.delete(room);
    }

    public RoomDTO addUsersToRoom(Room room, Set<Integer> userIdSet) {
        for (Integer userId : userIdSet) {
            User user = userService.findUserById(userId);
            user.getRoomList().add(room);
            userRepository.save(user);
        }

        return convertToDTO(room);
    }

    public Room findRoomById(int roomId) {
        return roomRepository.findById(roomId).orElseThrow(() ->
                new EntityNotFoundException("Room not found"));
    }

    public int[] getUserList(Room room) {
        int[] userList = new int[room.getUserList().size()];

        for (int i = 0; i < room.getUserList().size(); i++) {
            userList[i] = room.getUserList().get(i).getUserId();
        }

        return userList;
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
