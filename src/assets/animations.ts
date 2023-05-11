import { trigger, transition, style, animate, query, stagger } from "@angular/animations";

export const fadeInOut = trigger('fadeInOut', [
    transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms', style({ opacity: 0.25 }))
    ]),
    transition(':leave', [
        animate('200ms', style({ opacity: 0 }))
    ])
]);

export const fadeOutIn = trigger('fadeOutIn', [
    transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms', style({ opacity: 1 }))
    ]),
    transition(':leave', [
        animate('200ms', style({ opacity: 0 }))
    ])
]);

export const listAnimation = trigger('listAnimation', [
    transition('* <=> *', [
        query(':enter',
            [style({ opacity: 0 }), stagger('60ms', animate('600ms ease-out', style({ opacity: 1 })))],
            { optional: true }
        ),
        query(':leave',
            animate('300ms', style({ opacity: 0 })),
            { optional: true }
        )
    ])
]);