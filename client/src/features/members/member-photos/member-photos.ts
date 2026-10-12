
import { Component, inject, OnInit, output, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImageUpload } from '../../../shared/image-upload/image-upload';
import { MemberService } from '../../../core/services/member-service';
import { Photo } from '../../../types/member';
import { AccountService } from '../../../core/services/account-service';
import { User } from '../../../types/user';
import { StarButton } from '../../../shared/star-button/star-button';


@Component({
  selector: 'app-member-photos',
  standalone: true,
  imports: [ImageUpload,StarButton],
  templateUrl: './member-photos.html',
  styleUrl: './member-photos.css'
})
export class MemberPhotos implements OnInit {
  protected memberService = inject(MemberService);
  private route = inject(ActivatedRoute);
  mainPhotoChanged = output<string>();
  protected photos = signal<Photo[]>([]);
  protected loading = signal(false);

  private accountService = inject(AccountService);

  ngOnInit(): void {
    const memberId = this.route.parent?.snapshot.paramMap.get('id');

    if (!memberId) return;

    this.memberService.getMemberPhotos(memberId).subscribe({
      next: photos => this.photos.set(photos),
      error: error => console.error('Error loading photos:', error)
    });
  }

  onUploadImage(file: File) {
    this.loading.set(true);

    this.memberService.uploadPhoto(file).subscribe({
      next: photo => {
        this.photos.update(photos => [...photos, photo]);
        this.memberService.editMode.set(false);
        this.loading.set(false);
      },
      error: error => {
        console.error('Error uploading image:', error);
        this.loading.set(false);
      }
    });
  }
  // setMainPhoto(photo: Photo) {
  //   this.memberService.setMainPhoto(photo).subscribe({
  //     next: () => {
  //       const currentUser = this.accountService.currentUser();

  //       if (currentUser) {
  //         currentUser.image_URL = photo.url;
  //         this.accountService.setCurrentUser(currentUser as User);
  //       }

  //       this.memberService.member.update(member => {
  //         if (!member) return null;

  //         return {
  //           ...member,
  //           imageUrl: photo.url
  //         };
  //       });
  //     },
  //     error: error => console.error('Error setting main photo:', error)
  //   });
  // }


  setMainPhoto(photo: Photo) {
  this.memberService.setMainPhoto(photo).subscribe({
    next: () => {
      const currentUser = this.accountService.currentUser();

      if (currentUser) {
        this.accountService.setCurrentUser({
          ...currentUser,
          image_URL: photo.url
        });
      }

      this.memberService.member.update(member => {
        if (!member) return null;

        return {
          ...member,
          imageUrl: photo.url
        };
      });

      // Send the new image URL to the parent component
      this.mainPhotoChangged.emit(photo.url);
    },
    error: error => console.error('Error setting main photo:', error)
  });
}
}
