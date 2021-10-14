import { mock } from "jest-mock-extended";

import { IStorageProvider } from "../../../../shared/container/providers/StorageProvider/IStorageProvider";
import { ErrorWithStatus } from "../../../../utils/ErrorWithStatus";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryPetsRepository } from "../../repositories/in-memory/InMemoryPetsRepository";
import { UpdatePetAvatarUseCase } from "./UpdatePetAvatarUseCase";

let inMemoryPetsRepository: InMemoryPetsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let storageProviderMock: IStorageProvider;
let updatePetAvatarUseCase: UpdatePetAvatarUseCase;

let userId: string;

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

    await inMemoryPetsRepository.createAndSave({
      name: "FirstPetster",
      species: "Bird",
      birthday: new Date("2021-02-20"),
      gender: "Male",
      weight_kg: 0.1,
      user_id: userId,
    });

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

    await inMemoryPetsRepository.createAndSave({
      name: "Petster",
      species: "Hamster",
      birthday: new Date("2021-02-20"),
      gender: "Female",
      weight_kg: 0.1,
      user_id: userId,
    });

    await inMemoryPetsRepository.createAndSave({
      name: "Petster2",
      species: "Dog",
      user_id: userId,
    });
  });

  it("Should update pet avatar", async () => {
    let pet = await updatePetAvatarUseCase.execute(
      userId,
      "Petster",
      "testFile.png"
    );

    expect(storageProviderMock.save).toHaveBeenCalledWith(
      "testFile.png",
      "petsAvatars"
    );

    expect(pet.avatar).toEqual("testFile.png");

    pet = await updatePetAvatarUseCase.execute(
      userId,
      "Petster",
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
      updatePetAvatarUseCase.execute(userId, "Petster", "")
    ).rejects.toEqual(new ErrorWithStatus(400, "Please upload an avatar file"));
  });

  it("Should not update pet's avatar if user is invalid", async () => {
    await expect(
      updatePetAvatarUseCase.execute(
        "07f28f28-33f8-4b42-9dc1-8bb996bda4d7",
        "Petster",
        "testFile.png"
      )
    ).rejects.toEqual(new ErrorWithStatus(401, "Please authenticate"));
  });

  it("Should not update other user's pet avatar", async () => {
    await expect(
      updatePetAvatarUseCase.execute(userId, "FirstPetster", "testFile.png")
    ).rejects.toEqual(new ErrorWithStatus(404, "Pet not found!"));
  });
});
