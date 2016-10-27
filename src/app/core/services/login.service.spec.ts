import {inject, TestBed} from "@angular/core/testing";
import {
  ResponseOptions,
  Response,
  RequestMethod,
  HttpModule
} from "@angular/http";
import {MockBackend} from "@angular/http/testing";
import {AuthService} from "./auth.service";
import {APP_TEST_HTTP_PROVIDERS} from "../../../testing";

describe('AuthService', () => {

  let authService: AuthService;
  let backend: MockBackend;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
      ],
      providers: [
        APP_TEST_HTTP_PROVIDERS,
        AuthService,
      ],
    });
  });
  beforeEach(inject([AuthService, MockBackend], (..._) => {
    [authService, backend] = _;
  }));

  describe('.login', () => {
    it('can login', (done) => {
      backend.connections.subscribe(conn => {
        conn.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify({token: 'my jwt'}),
        })));
        expect(conn.request.method).toEqual(RequestMethod.Post);
        expect(conn.request.url).toEqual('/api/auth');
        expect(conn.request.json()).toEqual({
          email: 'test@test.com',
          password: 'secret',
        });
      });
      authService.login('test@test.com', 'secret').subscribe(() => {
        expect(localStorage.getItem('jwt')).toEqual('my jwt');
        done();
      });
    });
  }); // .login

  describe('.logout', () => {
    it('can logout', () => {
      localStorage.setItem('jwt', 'my jwt');
      authService.logout();
      expect(localStorage.getItem('jwt')).toBeFalsy();
    });
  }); // .logout

  describe('.isSignedIn', () => {
    describe('when not signed in', () => {
      it('should be false', () => {
        expect(authService.isSignedIn()).toBeFalsy();
      });
    });

    describe('when signed in', () => {
      beforeEach(() => localStorage.setItem('jwt', 'dummy'));
      it('should be true', () => {
        expect(authService.isSignedIn()).toBeTruthy();
      });
    });
  }); // .isSignedIn

});

