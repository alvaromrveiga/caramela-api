import { mock } from "jest-mock-extended";

import { IStorageProvider } from "../../../../shared/container/providers/StorageProvider/IStorageProvider";
import { AuthenticationError } from "../../../../shared/errors/AuthenticationError";
import { ErrorWithStatus } from "../../../../utils/ErrorWithStatus";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryPetsRepository } from "../../repositories/in-memory/InMemoryPetsRepository";
import { UpdatePetAvatarUseCase } from "./UpdatePetAvatarUseCase";

let inMemoryPetsRepository: InMemoryPetsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let storageProviderMock: IStorageProvider;
let updatePetAvatarUseCase: UpdatePetAvatarUseCase;

let userId: string;
let otherUserPetId: string;
let petOneId: string;
let petTwoId: string;

describe("Update Pet Avatar use case", () => {
  beforeEach(async () => {
    inMemoryPetsRepository = new InMemoryPetsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    storageProviderMock = mock<IStorageProvider>();

    updatePetAvatarUseCase = new UpdatePetAvatarUseCase(
      inMemoryPetsRepository,
      inMemoryUsersRepository,
      storageProviderMock
    );

    await inMemoryUsersRepository.createAndSave({
      email: "firstTester@mail.com",
      name: "FirstTester",
      password: "testerPassword",
    });

    let user = await inMemoryUsersRepository.findByEmail(
      "firstTester@mail.com"
    );

    expect(user).toBeDefined();
    if (user) {
      userId = user.id;
    }

    let pet = await inMemoryPetsRepository.createAndSave({
      name: "FirstPetster",
      species: "Bird",
      birthday: new Date("2021-02-20"),
      gender: "Male",
      weight_kg: 0.1,
      user_id: userId,
    });
    otherUserPetId = pet.id;

    await inMemoryUsersRepository.createAndSave({
      email: "tester@mail.com",
      name: "Tester",
      password: "testerPassword",
    });

    user = await inMemoryUsersRepository.findByEmail("tester@mail.com");

    expect(user).toBeDefined();
    if (user) {
      userId = user.id;
    }

    pet = await inMemoryPetsRepository.createAndSave({
      name: "Petster",
      species: "Hamster",
      birthday: new Date("2021-02-20"),
      gender: "Female",
      weight_kg: 0.1,
      user_id: userId,
    });
    petOneId = pet.id;

    pet = await inMemoryPetsRepository.createAndSave({
      name: "Petster2",
      species: "Dog",
      user_id: userId,
    });
    petTwoId = pet.id;
  });

  it("Should update pet avatar", async () => {
    let pet = await updatePetAvatarUseCase.execute(
      userId,
      petOneId,
      "testFile.png"
    );

    expect(storageProviderMock.save).toHaveBeenCalledWith(
      "testFile.png",
      "petsAvatars"
    );

    expect(pet.avatar).toEqual("testFile.png");

    pet = await updatePetAvatarUseCase.execute(
      userId,
      petOneId,
      "testFile2.png"
    );

    expect(storageProviderMock.delete).toHaveBeenCalledWith(
      "testFile.png",
      "petsAvatars"
    );

    expect(storageProviderMock.save).toHaveBeenCalledWith(
      "testFile2.png",
      "petsAvatars"
    );

    expect(pet.avatar).toEqual("testFile2.png");
  });

  it("Should not update pet's avatar if avatar is invalid", async () => {
    await expect(
      updatePetAvatarUseCase.execute(userId, petOneId, "")
    ).rejects.toEqual(new ErrorWithStatus(400, "Please upload an avatar file"));
  });

  it("Should not update pet's avatar if user is invalid", async () => {
    await expect(
      updatePetAvatarUseCase.execute(
        "07f28f28-33f8-4b42-9dc1-8bb996bda4d7",
        petOneId,
        "testFile.png"
      )
    ).rejects.toEqual(new AuthenticationError());
  });

  it("Should not update other user's pet avatar", async () => {
    await expect(
      updatePetAvatarUseCase.execute(userId, otherUserPetId, "testFile.png")
    ).rejects.toEqual(new ErrorWithStatus(404, "Pet not found!"));
  });
});
