
import { Component, inject, OnInit, output, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImageUpload } from '../../../shared/image-upload/image-upload';
import { MemberService } from '../../../core/services/member-service';
import { Photo } from '../../../types/member';
import { AccountService } from '../../../core/services/account-service';
import { StarButton } from '../../../shared/star-button/star-button';
import { DeleteButton } from '../../../shared/delete-button/delete-button';


@Component({
  selector: 'app-member-photos',
  standalone: true,
  imports: [ImageUpload, StarButton, DeleteButton],
  templateUrl: './member-photos.html',
  styleUrl: './member-photos.css'
})
export class MemberPhotos implements OnInit {
  protected memberService = inject(MemberService);
  protected route = inject(ActivatedRoute);
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

         // If the member doesn't have a main image, use this photo.
      if (!this.memberService.member()?.imageUrl) {
        this.setMainLocalPhoto(photo);
      }
        this.memberService.editMode.set(false);
        this.loading.set(false);
      },
      error: error => {
        console.error('Error uploading image:', error);
        this.loading.set(false);
      }
    });
  }
  
    private setMainLocalPhoto(photo: Photo) {
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
}

//   setMainPhoto(photo: Photo) {
//   this.memberService.setMainPhoto(photo).subscribe({
//     next: () => {
//       const currentUser = this.accountService.currentUser();

//       if (currentUser) {
//         this.accountService.setCurrentUser({
//           ...currentUser,
//           image_URL: photo.url
//         });
//       }

//       this.memberService.member.update(member => {
//         if (!member) return null;

//         return {
//           ...member,
//           imageUrl: photo.url
//         };
//       });

//       // Send the new image URL to the parent component
//       // this.mainPhotoChangged.emit(photo.url);`
//     },
//     error: error => console.error('Error setting main photo:', error)
//   });
// }

setMainPhoto(photo: Photo) {
  this.memberService.setMainPhoto(photo).subscribe({
    next: () => {
      this.setMainLocalPhoto(photo);
    },
    error: error => console.error('Error setting main photo:', error)
  });
}

deletePhoto(photoId: number)
{
  this.memberService.deletePhoto(photoId).subscribe({
    next:()=>{
      this.photos.update(photos => photos.filter(x =>x.id !=photoId))
    }
  })
}
}
