use 5.12.0;
use warnings;
use Cocoa::Growl ':all';
use File::Basename;

sub main {
    my ($target) = @_;

    growl_register(
        app           => 'CoffeeScript Compiler',
        notifications => [qw/ notif_success notif_failure /],
    );

    my $cmd = sprintf 'coffee -c -o js %s 2> /dev/stdout', $target;
    my $result = `$cmd`;

    my $title;
    my %params_notify;

    # failure
    if ( $result ) {
        $title = sprintf '%s: compile failed', (basename $target);
        %params_notify = (
            %params_notify,
            name        => 'notif_failure',
            title       => $title,
            description => $result,
            priority    => 3,
            sticky      => 1,
        );
    }
    # success
    else {
        $title = sprintf '%s: compiled', (basename $target);
        %params_notify = (
            %params_notify,
            name        => 'notif_success',
            title       => $title,
            description => 'ok.',
        );
    }

    growl_notify(%params_notify);
}

main(@ARGV);
__END__
