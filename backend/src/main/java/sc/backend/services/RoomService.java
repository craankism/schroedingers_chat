package sc.backend.services;

import jakarta.persistence.EntityNotFoundException;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
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

@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class RoomService {

    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    @Transactional
    public RoomDTO createRoom(CreateRoomDTO createRoomDTO, String authenticatedEmail) {
        User creator = userService.getUserByEmail(userRepository.findByEmail(authenticatedEmail));

        Room room = Room.builder()
                .name(createRoomDTO.getName())
                .build();

        creator.addCreatedRoom(room);
        Set<User> members = convertIdsToUsers(createRoomDTO.getUserIdSet());

        for (User member : members) {
            room.addUser(member);
        }

        room.addUser(creator);
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

    @Transactional
    public RoomDTO editRoom(int roomId, EditRoomDTO editRoomDTO) {
        Room room = findRoomById(roomId);

        if (!room.getName().equals(editRoomDTO.getName())) {
            room.setName(editRoomDTO.getName());
        }

        Set<User> desiredMembers = convertIdsToUsers(editRoomDTO.getUserIdSet());

        for (User currentMember : new HashSet<>(room.getUserSet())) {
            if (!desiredMembers.contains(currentMember)) {
                room.removeUser(currentMember);
            }
        }

        for (User desiredMember : desiredMembers) {
            if (!room.getUserSet().contains(desiredMember)) {
                room.addUser(desiredMember);
            }
        }

        return convertToDTO(room);
    }

    @Transactional
    public void deleteRoom(int roomId, String authenticatedEmail) {
        Room room = findRoomById(roomId);
        User authenticatedUser = userService.getUserByEmail(userRepository.findByEmail(authenticatedEmail));

        User creator = room.getCreatedBy();

        if (authenticatedUser.getUserId() != creator.getUserId() && !authenticatedUser.isAdmin()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not allowed to delete this room");
        }

        room.clearUsers();
        creator.removeCreatedRoom(room);

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
        int[] userArray = new int[room.getUserSet().size()];

        int i = 0;
        for (User user : room.getUserSet()) {
            userArray[i] = user.getUserId();
            i++;
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
