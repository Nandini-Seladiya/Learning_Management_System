import { TestBed } from '@angular/core/testing';

import { DataExtractService } from './data-extract.service';
import { allTrainers, trainersRes } from 'src/assets/data/requireForTest';

fdescribe('DataExtractService', () => {
  let service: DataExtractService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataExtractService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // describe('extractAllTrainers', () => {
  //   it('Should return only Trainers name and Value', () => {});
  // });

  it('should extract trainers name', () => {
    let res = service.exractAllTrainers(allTrainers);
    expect(res).toEqual(trainersRes);
  });
});