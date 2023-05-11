import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpService } from './http.service';
import { HttpClient } from '@angular/common/http';

fdescribe('HttpService', () => {
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let service: HttpService;

  //All user data has to be put here
  let userCreds = [
    {
      email: 'test1@asite.com',
      password: 'Qwerty@123',
    },
    {
      email: 'test2@asite.com',
      password: 'Qwerty@123',
    },
    {
      email: 'test3@asite.com',
      password: 'Qwerty@123',
    },
  ];

  let userCreds1 = [
    {
      email: 'test1@asite.com',
      password: 'Qwerty@123',
    },
    {
      email: 'test2@asite.com',
      password: 'Qwerty@123',
    },
    {
      email: 'test3@asite.com',
      password: 'Qwerty@123',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    service = new HttpService(httpClientSpy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  //Login Test
  describe('userLogin', () => {
    it('Should login', () => {
      httpClientSpy.post.and.returnValue(of(userCreds));
      let loginCred = { email: 'test@this.com', password: 'Qwerty@123' };
      service.userLogin(loginCred).subscribe({
        next: (res) => {
          userCreds.push(loginCred);
        },
      });
      expect(userCreds.length).toEqual(4);
      expect(httpClientSpy.post).toHaveBeenCalledTimes(1);
    });
  });

  //Logout Test
  describe('userLogout', () => {
    it('Should logout', () => {
      httpClientSpy.get.and.returnValue(of(userCreds1));
      service.userLogout().subscribe({
        next: (res) => {
          userCreds1.pop();
        },
      });
      expect(userCreds1.length).toEqual(2);
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
    });
  });

  //Get All MasterData Test (to apply validators for getting null)
  describe('getAllMasterData', () => {
    it('Should get All Masters Data', () => {
      httpClientSpy.get.and.returnValue(of());
      service.getAllMasterData().subscribe({
        next: (res) => {
          expect(res).toBeTruthy();
        },
      });
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
    });
  });

  //Upload Files
});